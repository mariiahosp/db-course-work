import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PaymentStatus, Prisma } from 'src/generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';

const orderInclude = {
  items: {
    include: {
      product: { select: { id: true, name: true, sku: true } },
    },
  },
  payment: true,
} satisfies Prisma.OrderInclude;


@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) { }

  async create(userId: string, dto: CreateOrderDto) {
    const productIds = dto.items.map((item) => item.productId);
    if (new Set(productIds).size !== productIds.length) {
      throw new BadRequestException('Each product can appear only once in an order');
    }

    return this.prisma.$transaction(async (tx) => {
      const products = await tx.product.findMany({
        where: { id: { in: productIds } },
      });

      if (products.length !== productIds.length) {
        throw new NotFoundException('Products not found');
      }

      const byId = new Map(products.map((product) => [product.id, product]));
      let total = new Prisma.Decimal(0);
      const lines: { productId: string; quantity: number; unitPrice: Prisma.Decimal }[] = [];
      for (const item of dto.items) {
        const product = byId.get(item.productId)!;
        if (!product.isActive) {
          throw new BadRequestException(`Product ${product.sku} is not active`);
        }
        const decreased = await tx.product.updateMany({
          where: {
            id: product.id,
            isActive: true,
            stock: { gte: item.quantity },
          },
          data: { stock: { decrement: item.quantity } },
        });
        if (decreased.count !== 1) {
          throw new BadRequestException(`Not enough stock for product ${product.sku}`);
        }
        total = total.add(product.price.mul(item.quantity));
        lines.push({
          productId: product.id,
          quantity: item.quantity,
          unitPrice: product.price,
        });
      }
      return tx.order.create({
        data: {
          userId,
          totalAmount: total,
          items: { create: lines },
          payment: {
            create: { amount: total, status: PaymentStatus.PENDING },
          },
        },
        include: orderInclude,
      });
    });

  }
}
