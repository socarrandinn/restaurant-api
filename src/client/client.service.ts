import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { PaginationDto } from 'src/common';
import { Repository } from 'typeorm';
import { Client } from './entities/client.entity';
import { Restaurant } from 'src/restaurant/entities/restaurant.entity';

@Injectable()
export class ClientService {
  constructor(
    @Inject('CLIENT_REPOSITORY')
    private clientRepository: Repository<Client>,
  ) {}

  async create(createClientDto: CreateClientDto): Promise<Client> {
    try {
      const client = this.clientRepository.create(createClientDto);
      return await this.clientRepository.save(client);
    } catch (error) {
      throw new BadRequestException('Failed to create client', error.message);
    }
  }

  async findAll(paginationDto: PaginationDto, softDelete = false) {
    const { page = 1, limit = 10 } = paginationDto;

    const [data, total] = await this.clientRepository.findAndCount({
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

  async findOne(id: string, softDelete = false): Promise<Client> {
    const client = await this.clientRepository.findOne({
      where: { id, softDelete },
    });

    if (!client) {
      throw new NotFoundException(`Client with id #${id} not found`);
    }

    return client;
  }

  async updateClient(
    id: string,
    updateClientDto: UpdateClientDto,
  ): Promise<Client> {
    const client = await this.findOne(id);
    Object.assign(client, updateClientDto);

    try {
      return await this.clientRepository.save(client);
    } catch (error) {
      throw new BadRequestException('Failed to update client', error.message);
    }
  }

  async remove(id: string): Promise<void> {
    const client = await this.findOne(id);
    client.softDelete = true;

    try {
      await this.clientRepository.save(client);
    } catch (error) {
      throw new BadRequestException('Failed to delete client', error.message);
    }
  }

  async findFavoriteRestaurants(clientId: string): Promise<Restaurant[]> {
    const client = await this.clientRepository.findOne({
      where: { id: clientId },
      relations: ['restaurants'],
    });

    return client ? client.restaurants : [];
  }
}
