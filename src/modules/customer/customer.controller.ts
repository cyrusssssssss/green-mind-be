import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  NotFoundException,
  BadRequestException
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { Customer } from 'src/modules/customer/entity/customer.entity';
import { UpdateCustomerDto, UpdateCustomerWithNewUsernameDto } from './dto/customer.dto';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get(':username')
  async getCustomerByUsername(
    @Param('username') username: string,
  ): Promise<Customer> {
    const customer = await this.customerService.getCustomerByUsername(username);

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    return customer;
  }

  @Post('updateWithNewUsername')
  async updateCustomerWithNewUsername(
    @Body() updatedCustomer: UpdateCustomerWithNewUsernameDto,
  ) {
    try {
      const customer = await this.customerService.updateCustomerWithNewUsername(
        updatedCustomer
      );
      return customer;
    } catch (error) {
      return { error: error.message };
    }
  }

  @Post('update')
  async updateCustomer(
    @Body() updatedCustomer: UpdateCustomerDto,
  ) {
    try {
      const customer = await this.customerService.updateCustomer(
        updatedCustomer
      );
      return customer;
    } catch (error) {
      return { error: error.message };
    }
  }
}
