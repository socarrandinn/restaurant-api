import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { UniqueRestaurantNameInterceptor } from '../interceptor/restaurant-name.interceptor';

export function ValidateUniqueRestaurantName() {
  return applyDecorators(UseInterceptors(UniqueRestaurantNameInterceptor));
}
