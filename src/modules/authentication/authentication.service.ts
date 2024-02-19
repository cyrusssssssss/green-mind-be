import { JwtService } from '@nestjs/jwt';
import { CustomerService } from '../customer/customer.service';
import { Customer } from '../customer/entity/customer.entity';
import { User } from '../user/entity/user.entity';
import { UserService } from '../user/user.service';
import { CartService } from '../cart/cart.service';
import { Login, NewUserDTO } from './dto/newUser.dto';
import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt'; //ma hoa mk
@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userService: UserService,
    private readonly customerService: CustomerService,
    private readonly jwtService: JwtService, //tao token
    private readonly cartService: CartService,
  ) {}
  public async register(newUser: NewUserDTO) {
    const user = await this.userService.getUserByUsername(newUser.username);
    if (user) {
      throw new HttpException('User already existed', HttpStatus.BAD_REQUEST);
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newUser.password, salt);
    

    try {
      const user = new User();
      const customer = new Customer();
      user.username = newUser.username;
      user.password = hash;
      user.role = 'customer';
      customer.address = newUser.address;
      customer.name = newUser.name;
      customer.phoneNumber = newUser.phoneNumber;
      customer.email = newUser.email;
      //customer.cart = cart;
      user.customer = customer;
      // customer.user = user;
      await this.userService.createUser(user);
      await this.customerService.addCustomer(customer);
      const cart = await this.cartService.createCart(customer)
      await this.customerService.addCartForCustomer(user.username, cart);
      
      return user;
    } catch (error) {
      console.log(error);
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
  private async verifyPassword(password: string, hashpassword: string) {
    // xem 2 mật khẩu match nhau không
    console.log(password);
    console.log(hashpassword);

    const isPasswordMatching = await bcrypt.compare(
      password, //mat khau truyen len
      hashpassword,
    ); //
    if (!isPasswordMatching) {
      throw new HttpException(
        'Wrong credentials provided ',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  public async getAuthenticationUser(username: string, password: string) {
    try {
      const haspassword =
        await this.userService.getPasswordByUsername(username);
      const user = await this.userService.getUserByUsername(username);
      await this.verifyPassword(password, haspassword);
      return user;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  public async getJWTToken(username: string) {
    const payload: TokenPayload = { username };
    const token = await this.jwtService.sign(payload);
    return token;
  }
  public async getJWTRefreshToken(username: string) {
    const payload: TokenPayload = { username };
    const refreshtoken = await this.jwtService.sign(payload, {
      secret: 'nhung101',
      expiresIn: '24h',
    });
    return refreshtoken;
  }
}
