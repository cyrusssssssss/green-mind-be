import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, JoinColumn } from 'typeorm';
import { Order } from './order.entity';
import { Product } from '../../product/entity/product.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class OrderProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @Exclude()
  @ManyToOne(() => Order, (order) => order.orderProducts)
  order: Order;

  @ManyToOne(() => Product, (product) => product.cartProducts)
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column()
  quantity: number;
}
