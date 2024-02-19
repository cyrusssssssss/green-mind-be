import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from '../../user/entity/user.entity';
import { Cart } from '../../cart/entity/cart.entity';
import { Order } from '../../order/entity/order.entity';

@Entity()
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column()
  name: string;

  @Column()
  address: string;

  @Column()
  phoneNumber: string;
  
  @Column({nullable:true})
  email:string

  @OneToOne(() => User, user => user.customer,{onDelete:"CASCADE"})
  @JoinColumn()
  user: User;

  @OneToOne(() => Cart)
  @JoinColumn()
  cart: Cart;
  
  @OneToMany(() => Order, order => order.customer)
  orders: Order[];
}