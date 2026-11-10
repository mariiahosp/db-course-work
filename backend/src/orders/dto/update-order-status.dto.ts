import { Type } from 'class-transformer';
import { IsEnum, IsInt, Min } from 'class-validator';
import { OrderStatus } from 'src/generated/prisma/client';

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus)
  status!: OrderStatus;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  version!: number;
}
