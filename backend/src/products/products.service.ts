import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { QueryProductsDto } from './dto/query-product.dto';
import { Prisma } from 'src/generated/prisma/client';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ChangePriceDto } from './dto/change-price.dto';

const productInclude = {
  category: { select: { id: true, name: true, slug: true } },
} satisfies Prisma.ProductInclude;


@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) { }

  async findAll(query: QueryProductsDto) {
    const limit = query.limit ?? 20;
    const offset = query.offset ?? 0;
    const where: Prisma.ProductWhereInput = {
      ...(query.categoryId ? { categoryId: query.categoryId } : {}),
      ...(query.search
        ? {
          OR: [
            { name: { contains: query.search, mode: 'insensitive' } },
            { sku: { contains: query.search, mode: 'insensitive' } },
          ],
        }
        : {}),
    };

    const [data, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        include: productInclude,
        orderBy: { price: query.priceOrder ?? 'desc' },
        skip: offset,
        take: limit,
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      data,
      total,
      limit,
      offset,
    };
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: productInclude,
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async create(dto: CreateProductDto) {
    try {
      return await this.prisma.product.create({
        data: {
          categoryId: dto.categoryId,
          sku: dto.sku,
          name: dto.name,
          description: dto.description,
          price: dto.price,
          stock: dto.stock,
          isActive: dto.isActive ?? true,
        },
        include: productInclude,
      })
    } catch (error) {
      this.rethrowKnown(error);
    }
  }

  async update(id: string, dto: UpdateProductDto) {
    if (Object.keys(dto).length === 0) {
      throw new BadRequestException('No fields to update');
    }
    try {
      return await this.prisma.product.update({
        where: { id },
        data: dto,
        include: productInclude,
      });
    } catch (error) {
      this.rethrowKnown(error);
    }
  }

  async changePrice(id: string, userId: string, dto: ChangePriceDto) {
    return this.prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({ where: { id } });

      if (!product) {
        throw new NotFoundException('Product not found');
      }

      if (product.version !== dto.version) {
        throw new ConflictException('Product was updated by someone else');
      }

      const newPrice = new Prisma.Decimal(dto.price);

      if (product.price.equals(newPrice)) {
        throw new BadRequestException('Price is unchanged');
      }

      const updated = await tx.product.updateMany({
        where: { id, version: dto.version },
        data: {
          price: newPrice,
          version: { increment: 1 },
        },
      });

      if (updated.count !== 1) {
        throw new ConflictException('Product was updated by someone else');
      }

      await tx.priceHistory.create({
        data: {
          productId: id,
          changedById: userId,
          oldPrice: product.price,
          newPrice,
        },
      });

      return tx.product.findUnique({
        where: { id },
        include: productInclude,
      });
    });
  }

  private rethrowKnown(error: unknown): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      throw new ConflictException('Product with this sku already exists');
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
      throw new NotFoundException('Category not found');
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      throw new NotFoundException('Product not found');
    }
    throw error;
  }
}
