import { Module } from '@nestjs/common';
import { Product } from '../product/entity/product.entity';
import { Customer } from '../customer/entity/customer.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from '../product/product.module';
import { CustomerModule } from '../customer/customer.module';
import { CartModule } from '../cart/cart.module';
import { Cart } from '../cart/entity/cart.entity';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { OrderModule } from '../order/order.module';
import { Order } from '../order/entity/order.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Order, Product, Customer]),
        ProductModule,
        CustomerModule,
        CartModule,
        OrderModule
      ],
      providers: [PaymentService],
      controllers: [PaymentController],
      exports: [PaymentService]
})
export class PaymentModule {}
