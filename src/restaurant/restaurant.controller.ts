import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { ApiTags } from '@nestjs/swagger';
import { FilterSoftDelete } from 'src/common/decorators/filter-soft-delete.decorator';
import { PaginationDto } from 'src/common';
import { ValidateUniqueRestaurantName } from './decorator/restaurant-name.validator';
@FilterSoftDelete()
@ApiTags('restaurant')
@Controller('restaurant')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}
  @ValidateUniqueRestaurantName()
  @Post()
  create(@Body() createRestaurantDto: CreateRestaurantDto) {
    return this.restaurantService.create(createRestaurantDto);
  }

  @Get()
  findAll(
    @Query() paginationDto: PaginationDto,
    @Query('softDelete') softDelete?: boolean,
  ) {
    return this.restaurantService.findAll(paginationDto, softDelete);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('softDelete') softDelete?: boolean,
  ) {
    return this.restaurantService.findOne(id, softDelete);
  }

  @Patch(':id')
  @ValidateUniqueRestaurantName()
  updateClient(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateClientDto: UpdateRestaurantDto,
  ) {
    return this.restaurantService.updateClient(id, updateClientDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.restaurantService.remove(id);
  }
}
