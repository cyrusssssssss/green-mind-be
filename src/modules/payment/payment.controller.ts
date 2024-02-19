import { Controller, Post, Body, Get } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreateOrderDto, GetUrlDto } from './dto/payment.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('/makeOrder')
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    try {
      const order = await this.paymentService.processPayment(
        createOrderDto.customerId,
        createOrderDto.products,
        createOrderDto.paymentMethod,
        createOrderDto.vnp_ResponseCode,
      );
      return { order };
    } catch (error) {
      return { error: error.message };
    }
  }


  @Post()
  async generateVnpayUrl(@Body() getUrlDto: GetUrlDto) {
    try {
      const url = this.paymentService.generateVnpayUrl(
        getUrlDto.customerId,
        getUrlDto.amount
      )
      return url;
    } catch (error) {
      return { error: error.message };
    }
  }
}
