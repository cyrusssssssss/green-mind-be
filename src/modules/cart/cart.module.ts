import { Module } from '@nestjs/common';
import { Cart } from './entity/cart.entity';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../product/entity/product.entity';
import { Customer } from '../customer/entity/customer.entity';
import { ProductModule } from '../product/product.module';
import { CustomerModule } from '../customer/customer.module';
import { CartProduct } from './entity/cartProduct.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart, Product, Customer, CartProduct]),
    ProductModule,
    CustomerModule,
  ],
  providers: [CartService],
  controllers: [CartController],
  exports: [CartService]
})
export class CartModule {}
