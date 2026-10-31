import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { QueryUsersDto } from './dto/query-users.dto';
import { Prisma, Role } from '../generated/prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';

const publicUserSelect = {
  id: true,
  email: true,
  name: true,
  role: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UserSelect;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) { }

  async findAll(query: QueryUsersDto) {
    const limit = query.limit ?? 20;
    const offset = query.offset ?? 0;
    const where = this.buildWhere(query);

    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        select: publicUserSelect,
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit,
      }),
      this.prisma.user.count({ where }),
    ])

    return { data, total, limit, offset };
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id, deletedAt: null },
      select: publicUserSelect,
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async create(dto: CreateUserDto) {
    try {
      return await this.prisma.user.create({
        data: {
          email: dto.email,
          passwordHash: await bcrypt.hash(dto.password, 10),
          name: dto.name,
          role: dto.role ?? Role.CUSTOMER,
        },
        select: publicUserSelect,
      })
    } catch (error) {
      this.rethrowUniqueEmail(error)
    }
  }

  async update(id: string, dto: UpdateUserDto) {
    const data: Prisma.UserUpdateInput = {};

    if (dto.email !== undefined) data.email = dto.email.toLowerCase();
    if (dto.password !== undefined) data.passwordHash = await bcrypt.hash(dto.password, 10);
    if (dto.name !== undefined) data.name = dto.name;
    if (dto.role !== undefined) data.role = dto.role;

    if (Object.keys(data).length === 0) {
      throw new BadRequestException('No fields to update');
    }

    try {
      const result = await this.prisma.user.updateMany({
        where: { id, deletedAt: null },
        data,
      });

      if (result.count === 0) {
        throw new NotFoundException('User not found');
      }
    } catch (error) {
      this.rethrowUniqueEmail(error)
    }

    return this.findOne(id);
  }

  async softDelete(id: string) {
    const result = await this.prisma.user.updateMany({
      where: { id, deletedAt: null },
      data: { deletedAt: new Date() },
    })

    if (result.count === 0) {
      throw new NotFoundException('User not found');
    }

    return { id, deleted: true }
  }

  private rethrowUniqueEmail(error: unknown): never {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throw new ConflictException('User with this email already exists');
    }
    throw error;
  }

  private buildWhere(query: QueryUsersDto): Prisma.UserWhereInput {
    return {
      deletedAt: null,
      ...(query.role ? { role: query.role } : {}),
      ...(query.createdAfter
        ? { createdAt: { gt: new Date(query.createdAfter) } }
        : {}),
      ...(query.search
        ? {
          OR: [
            { email: { contains: query.search, mode: 'insensitive' } },
            { name: { contains: query.search, mode: 'insensitive' } },
          ],
        }
        : {}),
    };
  }
}
