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

    // Verificar y obtener el restaurante
    const restaurant =
      await this.orderService.verifyRestaurantExists(restaurantId);
    // Verificar y obtener el cliente
    const client = await this.orderService.verifyClientExists(clientId);

    // Adjuntar los objetos `restaurant` y `client` al request para su uso posterior
    request.restaurant = restaurant;
    request.client = client;

    // Verificar si el cliente ya tiene una orden en el mismo día
    const ordersToday = await this.orderService.getOrderToday(request.params);
    if (ordersToday.length > 0) {
      throw new BadRequestException(`Client has already ordered today`);
    }

    return true;
  }
}
