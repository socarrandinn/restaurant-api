import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { PaginationDto } from 'src/common';
import { FilterSoftDelete } from 'src/common/decorators/filter-soft-delete.decorator';
import { ApiTags } from '@nestjs/swagger';
import { Restaurant } from 'src/restaurant/entities/restaurant.entity';
import { Client } from './entities/client.entity';

@FilterSoftDelete()
@ApiTags('client')
@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post()
  create(@Body() createClientDto: CreateClientDto) {
    return this.clientService.create(createClientDto);
  }

  @Get()
  findAll(
    @Query() paginationDto: PaginationDto,
    @Query('softDelete') softDelete?: boolean,
  ) {
    return this.clientService.findAll(paginationDto, softDelete);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('softDelete') softDelete?: boolean,
  ) {
    return this.clientService.findOne(id, softDelete);
  }

  @Patch(':id')
  updateClient(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateClientDto: UpdateClientDto,
  ) {
    return this.clientService.updateClient(id, updateClientDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.clientService.remove(id);
  }

  // favorites restaurants
  @Post(':clientId/wishlist/:restaurantId')
  async addRestaurantToFavorites(
    @Param('clientId', ParseUUIDPipe) clientId: string,
    @Param('restaurantId', ParseUUIDPipe) restaurantId: string,
  ): Promise<Client> {
    return await this.clientService.addRestaurantToFavorites(
      clientId,
      restaurantId,
    );
  }

  @Get(':id/restaurants')
  async getFavoriteRestaurants(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Restaurant[]> {
    return this.clientService.findFavoriteRestaurants(id);
  }
}
