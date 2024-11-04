import { applyDecorators, UseGuards } from '@nestjs/common';
import { RestaurantClientExistGuard } from '../guards/order-valid.guard';

export function ValidRestaurantClientExist() {
  return applyDecorators(UseGuards(RestaurantClientExistGuard));
}
