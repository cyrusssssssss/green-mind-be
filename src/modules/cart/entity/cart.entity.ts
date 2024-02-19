import { Entity, PrimaryGeneratedColumn, JoinTable, ManyToMany, OneToOne, JoinColumn, Column, OneToMany } from 'typeorm';
import { Customer } from '../../customer/entity/customer.entity';
import { CartProduct } from './cartProduct.entity';

@Entity()
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 0 })
  total: number;

  @OneToOne(() => Customer, { onDelete: "CASCADE"})
  @JoinColumn()
  customer: Customer;

  @OneToMany(() => CartProduct, (cartProducts) => cartProducts.cart)
  cartProducts: CartProduct[];
}