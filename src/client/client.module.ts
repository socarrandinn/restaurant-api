import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { clientProviders } from './client.providers';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [...clientProviders, ClientService],
  controllers: [ClientController],
  exports: [...clientProviders],
})
export class ClientModule {}
