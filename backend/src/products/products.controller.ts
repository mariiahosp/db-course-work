import { Body, Controller, ForbiddenException, Get, Param, ParseUUIDPipe, Patch, Post, Put, Query, Req } from '@nestjs/common';
import { ProductsService } from './products.service';
import { QueryProductsDto } from './dto/query-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { ChangePriceDto } from './dto/change-price.dto';

type AuthRequest = Request & { user: { id: string; role: string } };

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Get()
  findAll(@Query() query: QueryProductsDto) {
    return this.productsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @Put(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateProductDto) {
    return this.productsService.update(id, dto);
  }

  @Patch(':id')
  changePrice(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() request: AuthRequest,
    @Body() dto: ChangePriceDto,
  ) {
    if (request.user.role !== 'ADMIN') {
      throw new ForbiddenException('Only admins can change product prices');
    }

    return this.productsService.changePrice(id, request.user.id, dto);
  }
}
