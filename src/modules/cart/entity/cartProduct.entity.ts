import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, JoinColumn } from 'typeorm';
import { Cart } from './cart.entity';
import { Product } from '../../product/entity/product.entity';

@Entity()
export class CartProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Cart, (cart) => cart.cartProducts)
  cart: Cart;

  @ManyToOne(() => Product, (product) => product.cartProducts)
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column()
  quantity: number;
}
