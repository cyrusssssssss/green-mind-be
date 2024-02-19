import { IsArray, IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class ProductDto {
  @IsNumber()
  productId: number;

  @IsNumber()
  quantity: number;
}

export class CreateOrderDto {
  @IsNotEmpty()
  customerId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductDto)
  products: ProductDto[];

  @IsNotEmpty()
  paymentMethod: string;
}

export class GetOrdersByCustomerDto {
  @IsNotEmpty()
  customerId: number;
}

export class GetOrderByIdDto {
  @IsNotEmpty()
  orderId: number;
}

export class GetOrdersByDateDto {
  @IsNotEmpty()
  startDate: string;

  @IsNotEmpty()
  endDate : string;
}