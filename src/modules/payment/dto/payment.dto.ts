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

  @IsNotEmpty()
  vnp_ResponseCode: string;
}

export class GetUrlDto {
  @IsNotEmpty()
  customerId: number;
  @IsNotEmpty()
  amount: number;
}