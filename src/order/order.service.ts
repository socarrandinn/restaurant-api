import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { In, Not, Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './entities/order.entity';
import { Client } from 'src/client/entities/client.entity';
import { Restaurant } from 'src/restaurant/entities/restaurant.entity';
import { OrderPaginationDto } from './dto/order-pagination.dto';
import { ORDER_STATUS } from './constants/status.constants';

@Injectable()
export class OrderService {
  constructor(
    @Inject('CLIENT_REPOSITORY')
    private clientRepository: Repository<Client>,

    @Inject('RESTAURANT_REPOSITORY')
    private restaurantRepository: Repository<Restaurant>,

    @Inject('ORDER_REPOSITORY')
    private orderRepository: Repository<Order>,
  ) {}

  async create(
    createOrderDto: CreateOrderDto,
    client: Client,
    restaurant: Restaurant,
  ): Promise<Order> {
    const { restaurantId, description } = createOrderDto;

    const currentOrdersCount = await this.orderRepository.count({
      where: { restaurant: { id: restaurantId } },
    });
    if (currentOrdersCount >= restaurant.capacity) {
      throw new BadRequestException(
        `Restaurant has reached maximum client capacity`,
      );
    }

    const order = this.orderRepository.create({
      description,
      client,
      restaurant,
    });
    return await this.orderRepository.save(order);
  }

  async updateStatus(id: string, newStatus: ORDER_STATUS): Promise<Order> {
    const order = await this.orderRepository.findOne({ where: { id } });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (
      [ORDER_STATUS.DELIVERED, ORDER_STATUS.CANCELED].includes(order.status)
    ) {
      throw new BadRequestException(
        'Cannot update status of a delivered or canceled order',
      );
    }

    order.status = newStatus;
    return this.orderRepository.save(order);
  }

  async findAll(paginationDto: OrderPaginationDto, softDelete = false) {
    const { page = 1, limit = 10, status } = paginationDto;

    const [data, total] = await this.orderRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      where: { softDelete, ...(status ? { status } : {}) },
    });

    return {
      data,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  async getOrder(order: CreateOrderDto): Promise<Order[]> {
    const { clientId, restaurantId } = order;

    return await this.orderRepository.find({
      where: {
        client: { id: clientId },
        restaurant: { id: restaurantId },
        status: Not(In([ORDER_STATUS.DELIVERED, ORDER_STATUS.CANCELED])),
      },
    });
  }

  async verifyRestaurantExists(restaurantId: string): Promise<Restaurant> {
    const restaurant = await this.restaurantRepository.findOne({
      where: { id: restaurantId, softDelete: false },
      relations: ['orders'],
    });
    if (!restaurant) {
      throw new NotFoundException(
        `Restaurant with ID ${restaurantId} not found`,
      );
    }
    return restaurant;
  }

  async verifyClientExists(clientId: string): Promise<Client> {
    const client = await this.clientRepository.findOne({
      where: { id: clientId, softDelete: false },
      relations: ['orders'],
    });
    if (!client) {
      throw new NotFoundException(`Client with ID ${clientId} not found`);
    }
    return client;
  }
}
