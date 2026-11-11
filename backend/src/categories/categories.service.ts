import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { QueryCategoriesDto } from './dto/query-category.dto';
import { Prisma } from 'src/generated/prisma/client';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) { }

  async findAll(query: QueryCategoriesDto) {
    const limit = query.limit ?? 20;
    const offset = query.offset ?? 0;
    const where: Prisma.CategoryWhereInput = query.search
      ? {
        OR: [
          { name: { contains: query.search, mode: 'insensitive' } },
          { slug: { contains: query.search, mode: 'insensitive' } },
        ],
      }
      : {};

    const [data, total] = await Promise.all([
      this.prisma.category.findMany({
        where,
        orderBy: { name: 'asc' },
        skip: offset,
        take: limit
      }),
      this.prisma.category.count({ where })
    ]);

    return {
      data,
      total,
      limit,
      offset,
    }
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id }
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async create(dto: CreateCategoryDto) {
    try {
      return await this.prisma.category.create({
        data: dto
      })
    } catch (error) {
      this.rethrowKnown(error);
    }
  }

  async update(id: string, dto: UpdateCategoryDto) {
    if (dto.name === undefined && dto.slug === undefined && dto.imageUrl === undefined) {
      throw new BadRequestException('No fields to update');
    }

    try {
      return await this.prisma.category.update({
        where: { id },
        data: dto
      })
    } catch (error) {
      this.rethrowKnown(error);
    }
  }

  private rethrowKnown(error: unknown): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      throw new ConflictException('Category with this name or slug already exists');
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      throw new NotFoundException('Category not found');
    }
    throw error;
  }
}
