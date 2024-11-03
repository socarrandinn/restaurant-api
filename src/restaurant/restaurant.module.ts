import { Module } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { RestaurantController } from './restaurant.controller';
import { restaurantProviders } from './restaurant.providers';
import { DatabaseModule } from 'src/database/database.module';
import { UniqueRestaurantNameInterceptor } from './interceptor/restaurant-name.interceptor';

@Module({
  imports: [DatabaseModule],
  providers: [
    ...restaurantProviders,
    RestaurantService,
    UniqueRestaurantNameInterceptor,
  ],
  controllers: [RestaurantController],
  exports: [...restaurantProviders],
})
export class RestaurantModule {}
