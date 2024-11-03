import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { LessThan, MoreThanOrEqual, Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './entities/order.entity';
import { Client } from 'src/client/entities/client.entity';
import { Restaurant } from 'src/restaurant/entities/restaurant.entity';
import { PaginationDto } from 'src/common';

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

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const { clientId, restaurantId, description } = createOrderDto;

    // Verificar que el restaurante existe
    const restaurant = await this.restaurantRepository.findOne({
      where: { id: restaurantId },
      relations: ['orders', 'clients'],
    });
    if (!restaurant) {
      throw new NotFoundException(
        `Restaurant with ID ${restaurantId} not found`,
      );
    }

    // Verificar que el cliente existe
    const client = await this.clientRepository.findOne({
      where: { id: clientId },
      relations: ['orders'],
    });
    if (!client) {
      throw new NotFoundException(`Client with ID ${clientId} not found`);
    }

    // Verificar la cantidad máxima de clientes en el restaurante
    const currentOrdersCount = await this.orderRepository.count({
      where: { restaurant: { id: restaurantId } },
    });
    if (currentOrdersCount >= restaurant.capacity) {
      throw new BadRequestException(
        `Restaurant has reached maximum client capacity`,
      );
    }

    // Verificar si el cliente ya tiene una orden en el mismo día
    const ordersToday = await this.getOrderToday(createOrderDto);
    if (ordersToday.length > 0) {
      throw new BadRequestException(`Client has already ordered today`);
    }

    // Agregar el cliente al restaurante si no está ya incluido
    if (
      !restaurant.clients.some(
        (existingClient) => existingClient.id === client.id,
      )
    ) {
      restaurant.clients.push(client);
      await this.restaurantRepository.save(restaurant);
    }

    // Crear la orden
    const order = this.orderRepository.create({
      description,
      client,
      restaurant,
    });
    return await this.orderRepository.save(order);
  }

  async findAll(paginationDto: PaginationDto, softDelete = false) {
    const { page = 1, limit = 10 } = paginationDto;

    const [data, total] = await this.orderRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      where: { softDelete },
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

  async getOrderToday(order: CreateOrderDto): Promise<Order[]> {
    const { clientId, restaurantId } = order;
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    return await this.orderRepository.find({
      where: [
        {
          client: { id: clientId },
          restaurant: { id: restaurantId },
          createdAt: MoreThanOrEqual(startOfDay),
        },
        {
          client: { id: clientId },
          restaurant: { id: restaurantId },
          createdAt: LessThan(endOfDay),
        },
      ],
    });
  }
}
