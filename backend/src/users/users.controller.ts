import { Controller, Get, Param, Post, Body, Put, ParseUUIDPipe, Query, Delete, Req, ForbiddenException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUsersDto } from './dto/query-users.dto';
import { Roles } from '../auth/roles.decorator';

type AuthRequest = Request & { user: { id: string; role: string } };

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Roles('ADMIN')
  @Get()
  findAll(@Query() query: QueryUsersDto) {
    return this.usersService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() request: AuthRequest) {
    if (request.user.role !== 'ADMIN' && request.user.id !== id) {
      throw new ForbiddenException('You can only view your own profile');
    }

    return this.usersService.findOne(id);
  }

  @Roles('ADMIN')
  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Roles('ADMIN')
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  @Roles('ADMIN')
  @Delete(':id')
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.softDelete(id);
  }
}
