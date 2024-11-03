import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { orderProviders } from './order.providers';
import { DatabaseModule } from 'src/database/database.module';
import { ClientModule } from 'src/client/client.module';
import { RestaurantModule } from 'src/restaurant/restaurant.module';

@Module({
  imports: [DatabaseModule, ClientModule, RestaurantModule],
  providers: [...orderProviders, OrderService],
  controllers: [OrderController],
  exports: [OrderService],
})
export class OrderModule {}
