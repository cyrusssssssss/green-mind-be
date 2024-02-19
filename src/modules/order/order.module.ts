import { Module } from '@nestjs/common';
import { Order } from './entity/order.entity';
import { Product } from '../product/entity/product.entity';
import { Customer } from '../customer/entity/customer.entity';
import { OrderProduct } from './entity/orderProduct.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from '../product/product.module';
import { CustomerModule } from '../customer/customer.module';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { CartModule } from '../cart/cart.module';
import { Cart } from '../cart/entity/cart.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Order, Product, Customer, OrderProduct, Cart]),
        ProductModule,
        CustomerModule,
        CartModule,
      ],
      providers: [OrderService],
      controllers: [OrderController],
      exports: [OrderService]
})
export class OrderModule {}
