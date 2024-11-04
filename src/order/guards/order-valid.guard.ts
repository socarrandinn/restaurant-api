import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { OrderService } from '../order.service';

@Injectable()
export class RestaurantClientExistGuard implements CanActivate {
  constructor(private readonly orderService: OrderService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { restaurantId, clientId } = request.params;

    // verificar si el restaurante y el cliente existen
    const restaurant =
      await this.orderService.verifyRestaurantExists(restaurantId);
    const client = await this.orderService.verifyClientExists(clientId);

    // Adjuntar los objetos `restaurant` y `client` al request para su uso posterior
    request.restaurant = restaurant;
    request.client = client;

    // Verificar si el cliente ya tiene una orden
    const existOrder = await this.orderService.getOrder(request.params);
    if (existOrder.length > 0) {
      throw new BadRequestException(
        'Client has already placed an active order with this restaurant',
      );
    }

    return true;
  }
}
