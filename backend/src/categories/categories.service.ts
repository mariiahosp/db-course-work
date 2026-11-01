import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { QueryCategoriesDto } from './dto/query-category.dto';
import { Prisma } from 'src/generated/prisma/client';

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
}
