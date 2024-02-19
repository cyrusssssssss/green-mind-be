import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './entity/customer.entity';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { UserService } from '../user/user.service';
import { UserModule } from '../user/user.module';
import { User } from '../user/entity/user.entity';
import { Cart } from '../cart/entity/cart.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Customer, User, Cart])],
    exports:[CustomerService],
    providers:[CustomerService],
    controllers:[CustomerController]
})
export class CustomerModule {}
