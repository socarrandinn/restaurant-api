import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  ConflictException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { RestaurantService } from '../restaurant.service';
import { CreateRestaurantDto } from '../dto/create-restaurant.dto';

@Injectable()
export class UniqueRestaurantNameInterceptor implements NestInterceptor {
  constructor(private readonly restaurantService: RestaurantService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const createRestaurantDto: CreateRestaurantDto = request.body;

    // Obtener el id de los parámetros de la consulta
    const restaurantId = request.params.id;

    // Verifica si el nombre ya existe
    const existingRestaurant = await this.restaurantService.findByName(
      createRestaurantDto.name,
    );

    // Si hay un ID y se encontró un restaurante con el mismo nombre,
    // verificamos si no es el mismo que se está actualizando
    if (
      restaurantId &&
      existingRestaurant &&
      existingRestaurant.id !== restaurantId
    ) {
      throw new ConflictException('El nombre del restaurante ya existe');
    }

    // Si no hay un ID y ya existe un restaurante con ese nombre
    if (!restaurantId && existingRestaurant) {
      throw new ConflictException('El nombre del restaurante ya existe');
    }

    return next.handle();
  }
}
