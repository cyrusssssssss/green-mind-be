import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { CustomerService } from '../customer/customer.service';
import { ProductService } from '../product/product.service';
import { Customer } from '../customer/entity/customer.entity';
import { Order } from './entity/order.entity';
import { OrderProduct } from './entity/orderProduct.entity';
import * as CircularJSON from 'circular-json';
import { CartService } from '../cart/cart.service';
import { utcToZonedTime } from 'date-fns-tz';
import { startOfDay, endOfDay } from 'date-fns';
import { GetOrdersByDateDto } from './dto/order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order, 'default')
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderProduct)
    private readonly orderProductRepository: Repository<OrderProduct>,
    private readonly customerService: CustomerService,
    private readonly productService: ProductService,
    private readonly cartService: CartService,
    ) {}
    private getVietnamDateTime(): Date {
      const vietnamTimeZone = 'Asia/Ho_Chi_Minh';
      const currentUtcTime = new Date();
      const vietnamDateTime = utcToZonedTime(currentUtcTime, vietnamTimeZone);
      return vietnamDateTime;
    }
  async createOrder(
    customerId: number,
    products: { productId: number; quantity: number }[],
    paymentMethod: string,
  ): Promise<Order> {
    try {
      const total = await products.reduce(
        async (accPromise, { productId, quantity }) => {
          const acc = await accPromise;
          const product = await this.productService.findProductById(productId);
          if (!product) {
            throw new Error(`Product with ID ${productId} not found.`);
          }
          return acc + product.price * quantity;
        },
        Promise.resolve(0),
      );

      const customer = await this.customerService.getCustomerById(customerId);
      const order = new Order();
      order.name = customer.name;
      order.address = customer.address;
      order.phoneNumber = customer.phoneNumber;
      order.total = total;
      order.date = this.getVietnamDateTime();
      order.paymentMethod = paymentMethod;
      order.paymentStatus = paymentMethod === "Cash" ? 'Unpaid' : 'Paid';
      order.shipmentStatus = 'Pending';
      order.customer = customer;
      order.orderProducts = [];

      const orderProducts = products.map(async ({ productId, quantity }) => {

        // Xoá sản phẩm khỏi giỏ hàng
        await this.cartService.removeCartItemByProductId(customerId, productId);

        const product = await this.productService.findProductById(productId);
        if (!product) {
          throw new Error(`Product with ID ${productId} not found.`);
        }

        const newOrderProduct = new OrderProduct();
        newOrderProduct.order = order;
        newOrderProduct.product = product;
        newOrderProduct.quantity = quantity;

        return newOrderProduct;
      });

      order.orderProducts = await Promise.all(orderProducts);
      await this.orderRepository.save(order);

      return CircularJSON.stringify(order);
    } catch (error) {
      throw new Error(`Failed to create order: ${error.message}`);
    }
  }

  async getOrdersByCustomerId(customerId: number) {
    try {
      const customer = await this.customerService.getCustomerById(customerId);
      if (!customer) {
        throw new Error('Customer not found.');
      }
      let orders = await this.orderRepository.find({
        where: { customer },
        relations: ['orderProducts', 'orderProducts.product'],
      });
      if (!orders) {
        throw new Error('Cart not found.');
      }

      return orders;
    } catch (error) {
      console.log(`Failed to get orders: ${error.message}`);
      throw new Error(`Failed to get orders: ${error.message}`);
    }
  }

  async getOrderById(id: number) {
    try {
      const order = await this.orderRepository.findOne({
        where: { id },
        relations: ['orderProducts', 'orderProducts.product'],
      });
      if (!order) {
        throw new Error('Cart not found.');
      }
      return order;
    } catch (error) {
      console.log(`Failed to get order: ${error.message}`);
      throw new Error(`Failed to get order: ${error.message}`);
    }
  }

  async getAllOrders(): Promise<Order[]> {
    return await this.orderRepository.find();
  }

  async updateOrder(
    id: number,
    name: string,
    address: string,
    phoneNumber: string,
    date: Date,
    total: number,
    paymentMethod: string,
    paymentStatus: string,
    shipmentStatus: string,
    ordersProducts: OrderProduct[],
  ): Promise<Order | undefined> {
    const order = await this.getOrderById(id);

    if (!order) {
      return undefined;
    }

    order.name = name;
    order.address = address;
    order.phoneNumber = phoneNumber;
    order.date = date;
    order.total = total;
    order.paymentMethod = paymentMethod;
    order.paymentStatus = paymentStatus;
    order.shipmentStatus = shipmentStatus;
    order.orderProducts = order.orderProducts;

    return await this.orderRepository.save(order);
  }

  async getOrdersByDate(getOrdersByDateDto: GetOrdersByDateDto): Promise<Order[]> {
    const { startDate, endDate } = getOrdersByDateDto;

    const start = new Date(startDate);
    const end = new Date(endDate);

    const orders = await this.orderRepository.find({
        where: {
            date: Between(startOfDay(start), endOfDay(end)),
        },
    });

    return orders;
  }

}
