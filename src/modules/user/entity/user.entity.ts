import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { Customer } from '../../customer/entity/customer.entity';
import { Admin } from '../../admin/entity/admin.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column({select:false})
  password: string;

  @Column()
  role: string;

  @Column({ name: 'refreshToken', nullable: true, select: false })
  refreshToken: string;

  @OneToOne(() => Customer, (customer) => customer.user,{cascade:true})

  customer: Customer;

  @OneToOne(() => Admin, (admin) => admin.user,{cascade:true})
  
  admin: Admin;
}
