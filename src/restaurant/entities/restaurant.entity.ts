import { Client } from 'src/client/entities/client.entity';
import { CommonEntity } from 'src/common/entities/common.entity';
import { Order } from 'src/order/entities/order.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  OneToMany,
} from 'typeorm';

@Entity()
export class Restaurant extends CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column()
  capacity: number;

  @ManyToMany(() => Client, (client) => client.restaurants)
  clients: Client[];

  @OneToMany(() => Order, (order) => order.restaurant)
  orders: Order[];
}
