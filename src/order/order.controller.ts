// src/order/order.controller.ts
import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './entities/order.entity';
import { ApiTags } from '@nestjs/swagger';
import { FilterSoftDelete } from 'src/common/decorators/filter-soft-delete.decorator';
import { PaginationDto } from 'src/common';

@FilterSoftDelete()
@ApiTags('orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
    return this.orderService.create(createOrderDto);
  }

  @Get()
  findAll(
    @Query() paginationDto: PaginationDto,
    @Query('softDelete') softDelete?: boolean,
  ) {
    return this.orderService.findAll(paginationDto, softDelete);
  }
}
