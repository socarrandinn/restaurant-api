import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { Repository } from 'typeorm';
import { Restaurant } from './entities/restaurant.entity';
import { PaginationDto } from 'src/common';
import { createRegexPattern, normalizeName } from '../common/constants/utils';

@Injectable()
export class RestaurantService {
  constructor(
    @Inject('RESTAURANT_REPOSITORY')
    private restaurantRepository: Repository<Restaurant>,
  ) {}

  async create(createClientDto: CreateRestaurantDto): Promise<Restaurant> {
    try {
      const restaurant = this.restaurantRepository.create(createClientDto);
      return await this.restaurantRepository.save(restaurant);
    } catch (error) {
      throw new BadRequestException(
        'Failed to create restaurant',
        error.message,
      );
    }
  }

  async findAll(paginationDto: PaginationDto, softDelete = false) {
    const { page = 1, limit = 10 } = paginationDto;

    const [data, total] = await this.restaurantRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      where: { softDelete },
    });

    return {
      data,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, softDelete = false): Promise<Restaurant> {
    const restaurant = await this.restaurantRepository.findOne({
      where: { id, softDelete },
    });

    if (!restaurant) {
      throw new NotFoundException(`Restaurant with id #${id} not found`);
    }

    return restaurant;
  }

  async updateClient(
    id: string,
    updateClientDto: UpdateRestaurantDto,
  ): Promise<Restaurant> {
    const restaurant = await this.findOne(id);
    Object.assign(restaurant, updateClientDto);

    try {
      return await this.restaurantRepository.save(restaurant);
    } catch (error) {
      throw new BadRequestException(
        'Failed to update restaurant',
        error.message,
      );
    }
  }

  async remove(id: string): Promise<boolean> {
    const restaurant = await this.findOne(id);
    restaurant.softDelete = true;

    try {
      await this.restaurantRepository.save(restaurant);
      return true;
    } catch (error) {
      throw new BadRequestException(
        'Failed to delete restaurant',
        error.message,
      );
    }
  }

  async findByName(name: string): Promise<Restaurant | null> {
    const normalizedName = normalizeName(name);
    const regexPattern = createRegexPattern(normalizedName);

    return this.restaurantRepository
      .createQueryBuilder('restaurant')
      .where('restaurant.name ILIKE :name', { name: regexPattern })
      .andWhere('restaurant.softDelete = false')
      .getOne();
  }
}
