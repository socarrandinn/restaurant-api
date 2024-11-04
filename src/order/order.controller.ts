// src/order/order.controller.ts
import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Req,
  Patch,
  Param,
  ParseUUIDPipe,
  BadRequestException,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './entities/order.entity';
import { ApiTags } from '@nestjs/swagger';
import { FilterSoftDelete } from 'src/common/decorators/filter-soft-delete.decorator';
import { ValidRestaurantClientExist } from './decorator/order-valid.decorator';
import { OrderPaginationDto } from './dto/order-pagination.dto';
import { ORDER_STATUS } from './constants/status.constants';
import { OrderStatusValidationPipe } from './pipes/order-status.validation.pipes';

@FilterSoftDelete()
@ApiTags('orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @ValidRestaurantClientExist()
  async create(
    @Body() createOrderDto: CreateOrderDto,
    @Req() request,
  ): Promise<Order> {
    const { client, restaurant } = request;
    return this.orderService.create(createOrderDto, client, restaurant);
  }

  @Get()
  findAll(
    @Query() paginationDto: OrderPaginationDto,
    @Query('softDelete') softDelete?: boolean,
  ) {
    return this.orderService.findAll(paginationDto, softDelete);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('status', OrderStatusValidationPipe) status: ORDER_STATUS,
  ): Promise<Order> {
    if (!Object.values(ORDER_STATUS).includes(status)) {
      throw new BadRequestException('Invalid status');
    }
    return this.orderService.updateStatus(id, status);
  }
}
