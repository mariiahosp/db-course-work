import { Body, Controller, Post, Req } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';

type AuthRequest = Request & { user: { id: string } };

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  @Post()
  create(@Req() request: AuthRequest, @Body() dto: CreateOrderDto) {
    return this.ordersService.create(request.user.id, dto);
  }
}
