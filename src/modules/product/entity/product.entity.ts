import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany } from 'typeorm';
import { Category } from '../../category/entity/category.entity';
import { CartProduct } from '../../cart/entity/cartProduct.entity';
import { OrderProduct } from '../../order/entity/orderProduct.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  price: number;

  @Column()
  quantity: number;

  @Column()
  image: string;

  @ManyToMany(() => Category, category => category.products)
  categories: Category[];

  @OneToMany(() => CartProduct, cartProducts => cartProducts.product)
  cartProducts: CartProduct[];

  @OneToMany(() => OrderProduct, orderProducts => orderProducts.product)
  orderProducts: OrderProduct[];
}