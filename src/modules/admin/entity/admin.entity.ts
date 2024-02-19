import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../../user/entity/user.entity';

@Entity()
export class Admin {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  position: string;


  @OneToOne(() => User, user => user.customer, {onDelete:"CASCADE"})
  @JoinColumn({name:"userId"})
  user: User;

}