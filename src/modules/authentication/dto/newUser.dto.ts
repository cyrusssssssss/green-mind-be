import { ApiProperty } from '@nestjs/swagger';
import { Cart } from 'src/modules/cart/entity/cart.entity';

export class NewUserDTO {
  @ApiProperty()
  username: string;
  @ApiProperty()// chưa cần cái này để kết nối với swagger
  password: string;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  
}
export class Login {    
  @ApiProperty()
  username: string;
  @ApiProperty()
  password: string;
}
