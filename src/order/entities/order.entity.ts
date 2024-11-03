import { Client } from 'src/client/entities/client.entity';
import { CommonEntity } from 'src/common/entities/common.entity';
import { Restaurant } from 'src/restaurant/entities/restaurant.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class Order extends CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  description: string;

  @ManyToOne(() => Client, (client) => client.orders, { onDelete: 'CASCADE' })
  client: Client;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.orders, {
    onDelete: 'CASCADE',
  })
  restaurant: Restaurant;
}
