import { Type } from 'class-transformer';
import { IsInt, IsNumber, Min } from 'class-validator';

export class ChangePriceDto {
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  price!: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  version!: number;
}
