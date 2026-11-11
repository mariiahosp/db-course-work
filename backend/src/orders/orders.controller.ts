import { Body, Controller, Delete, Param, ParseUUIDPipe, Patch, Post, Req } from '@nestjs/common';
import { Roles } from '../auth/roles.decorator';
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

  @Roles('ADMIN')
  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateStatus(id, dto);
  }

  @Roles('ADMIN')
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.ordersService.remove(id);
  }
}
