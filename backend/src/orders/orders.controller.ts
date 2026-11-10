import { Body, Controller, Delete, ForbiddenException, Param, ParseUUIDPipe, Patch, Post, Req } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

type AuthRequest = Request & { user: { id: string, role: string } };

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  @Post()
  create(@Req() request: AuthRequest, @Body() dto: CreateOrderDto) {
    return this.ordersService.create(request.user.id, dto);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() request: AuthRequest,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    if (request.user.role !== 'ADMIN') {
      throw new ForbiddenException('Only admins can update order status');
    }

    return this.ordersService.updateStatus(id, dto);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() request: AuthRequest,
  ) {
    if (request.user.role !== 'ADMIN') {
      throw new ForbiddenException('Only admins can delete orders');
    }

    return this.ordersService.remove(id);
  }
}
