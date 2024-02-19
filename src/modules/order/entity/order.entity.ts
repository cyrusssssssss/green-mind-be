import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { Customer } from '../../customer/entity/customer.entity';
import { OrderProduct } from './orderProduct.entity';
import { Exclude, Transform, Type } from 'class-transformer';


@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column()
  phoneNumber: string;

  @Column()
  total: number;

  @Column()
  date: Date;

  @Column()
  paymentMethod: string;

  @Column()
  paymentStatus: string;

  @Column()
  shipmentStatus: string;

  @ManyToOne(() => Customer, customer => customer.orders)
  customer: Customer;

  @Exclude()
  @OneToMany(() => OrderProduct, (orderProducts) => orderProducts.order,  { cascade: true })
  orderProducts: OrderProduct[];

@Transform(({ value }) => value.map(orderProduct => ({ product: orderProduct.product, quantity: orderProduct.quantity }))) // Chuyển đổi
  @Type(() => OrderProduct)
  get formattedOrderProducts(): OrderProduct[] {
    return this.orderProducts as OrderProduct[];
  }
}