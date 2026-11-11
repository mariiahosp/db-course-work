import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { OrderStatus, PaymentStatus, Prisma } from 'src/generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

const orderInclude = {
  user: { select: { id: true, email: true, name: true } },
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

  async findAll(userId: string, role: string) {
    return this.prisma.order.findMany({
      where: role === 'ADMIN' ? {} : { userId },
      include: orderInclude,
      orderBy: { createdAt: 'desc' },
    })
  }

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

  async updateStatus(id: string, dto: UpdateOrderStatusDto) {
    const transitions: Record<OrderStatus, OrderStatus[]> = {
      PLACED: [OrderStatus.IN_TRANSIT, OrderStatus.CANCELLED],
      IN_TRANSIT: [OrderStatus.DELIVERED, OrderStatus.CANCELLED],
      DELIVERED: [],
      CANCELLED: [],
    };

    return this.prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({ where: { id } });

      if (!order) {
        throw new NotFoundException('Order not found');
      }

      if (order.version !== dto.version) {
        throw new ConflictException('Order was updated by someone else');
      }

      if (!transitions[order.status].includes(dto.status)) {
        throw new BadRequestException(`Cannot change status from ${order.status} to ${dto.status}`);
      }

      const updatedOrder = await tx.order.updateMany({
        where: { id, version: dto.version },
        data: {
          status: dto.status,
          version: { increment: 1 },
        }
      })

      if (updatedOrder.count !== 1) {
        throw new ConflictException('Order was updated by someone else');
      }

      return tx.order.findUnique({
        where: { id },
        include: orderInclude,
      })
    })
  }

  async remove(id: string) {
    return this.prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id },
        include: { payment: true }
      })

      if (!order) {
        throw new NotFoundException('Order not found');
      }

      if (order.status !== OrderStatus.CANCELLED || order.payment?.status !== PaymentStatus.PENDING) {
        throw new BadRequestException('Only a cancelled unpaid order can be deleted');
      }

      const deletedOrder = await tx.order.deleteMany({
        where: {
          id,
          status: OrderStatus.CANCELLED,
          payment: {
            status: PaymentStatus.PENDING,
          }
        }
      })

      if (deletedOrder.count !== 1) {
        throw new ConflictException('Order was updated by someone else');
      }

      return { id, deleted: true }
    })
  }
}
