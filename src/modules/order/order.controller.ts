import {
  Controller,
  Get,
  Post,
  Delete,
  Put,
  Body,
  Param,
  NotFoundException,
  Query, ValidationPipe
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto, GetOrderByIdDto, GetOrdersByCustomerDto, GetOrdersByDateDto } from './dto/order.dto';
import { OrderProduct } from './entity/orderProduct.entity';
import { Order } from './entity/order.entity';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    try {
      const order = await this.orderService.createOrder(
        createOrderDto.customerId,
        createOrderDto.products,
        createOrderDto.paymentMethod,
      );
      return { order };
    } catch (error) {
      return { error: error.message };
    }
  }

  @Post('history')
  async getOrdersByCustomerId(@Body() getOrdersByCustomerDto: GetOrdersByCustomerDto,
  ) {
    try {
      const orders = await this.orderService.getOrdersByCustomerId(
        getOrdersByCustomerDto.customerId,
      );
      return { orders };
    } catch (error) {
      return { error: error.message };
    }
  }

  @Post('orderInfo')
  async getOrderById(@Body() getOrderByIdDto: GetOrderByIdDto,
  ) {
    try {
      const order = await this.orderService.getOrderById(
        getOrderByIdDto.orderId,
      );
      return order;
    } catch (error) {
      return { error: error.message };
    }
  }

  @Get()
  async getOrders() {
    const orders = await this.orderService.getAllOrders();
    return orders;
  }

  @Put(':id')
  async updateOrder(
    @Param('id') id: number,
    @Body()
    body: {
      name: string,
    address: string,
    phoneNumber: string,
    date: Date,
    total: number,
    paymentMethod: string,
    paymentStatus: string,
    shipmentStatus: string,
    ordersProducts: OrderProduct[],
    },
  ) {
    const existingProduct = await this.orderService.getOrderById(id);

    if (!existingProduct) {
      throw new NotFoundException(`Order with id ${id} does not exist.`);
    }
    const updatedOrder = await this.orderService.updateOrder(
      id,
      body.name,
      body.address,
      body.phoneNumber,
      body.date,
      body.total,
      body.paymentMethod,
      body.paymentStatus,
      body.shipmentStatus,
      body.ordersProducts
    );
    return updatedOrder;
  }

  @Get(':id')
  async getProductById(@Param('id') id: number) {
    const order = await this.orderService.getOrderById(id);
    if (!order) {
      throw new NotFoundException(`Order with id ${id} does not exist.`);
    }
    return order;
  }

  @Post('by-date')
  async getOrdersByDate (@Body() getOrdersByDateDto: GetOrdersByDateDto,): Promise<Order[]> {
    return this.orderService.getOrdersByDate(getOrdersByDateDto);
  }
}
