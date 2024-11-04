import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { clientProviders } from './client.providers';
import { DatabaseModule } from 'src/database/database.module';
import { RestaurantModule } from 'src/restaurant/restaurant.module';

@Module({
  imports: [DatabaseModule, RestaurantModule],
  providers: [...clientProviders, ClientService],
  controllers: [ClientController],
  exports: [...clientProviders],
})
export class ClientModule {}
