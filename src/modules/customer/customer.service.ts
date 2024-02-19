import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from './entity/customer.entity';
import { Repository } from 'typeorm';
import { NewCustomer, UpdateCustomerDto, UpdateCustomerWithNewUsernameDto } from './dto/customer.dto';
import { User } from '../user/entity/user.entity';
import { Cart } from '../cart/entity/cart.entity';
@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
  ) {}

  public async addCustomer(newCustomer: NewCustomer) {
    const customer = await this.customerRepository.save(newCustomer);

    // const cart = this.cartRepository.create({ customer, products: [] });
    // await this.cartRepository.save(cart);

    // // Gán giỏ hàng cho tài khoản
    // customer.cart = cart;
    // await this.userRepository.save(customery);
    return customer;
  }

  public async getCustomerByUsername(
    username: string,
  ): Promise<Customer | undefined> {
    return this.customerRepository
      .createQueryBuilder('customer')
      .innerJoinAndSelect('customer.user', 'user')
      .where('user.username = :username', { username })
      .getOne();
  }

  public async getCustomerById(id: number): Promise<Customer> {
    // Tìm khách hàng bằng ID trong cơ sở dữ liệu
    const customer = await this.customerRepository.findOne( {where: { id } });

    // Nếu không tìm thấy, ném ngoại lệ NotFoundException
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found.`);
    }

    return customer;
  }

  public async updateCustomerWithNewUsername(updatedCustomer: UpdateCustomerWithNewUsernameDto): Promise<Customer> {
    const user = await this.userRepository.findOneBy({ username: updatedCustomer.oldUsername });
    if (!user) {
      throw new HttpException('User does not exist', HttpStatus.BAD_REQUEST,);
    }

    user.username = updatedCustomer.newUsername;
    await this.userRepository.save(user);

    const customer = await this.customerRepository.findOne({ where: {user} });
    if (!customer) {
        throw new HttpException('Customer does not exist', HttpStatus.BAD_REQUEST,);
    }

    customer.name = updatedCustomer.name;
    customer.email = updatedCustomer.email;
    customer.phoneNumber = updatedCustomer.phonenumber;
    customer.address = updatedCustomer.address;
    customer.cart = customer.cart;

    const updated = await this.customerRepository.save(customer);
    return updated;
  }

  public async updateCustomer(updatedCustomer: UpdateCustomerDto): Promise<Customer> {
    const user = await this.userRepository.findOneBy({ username: updatedCustomer.username });
    if (!user) {
      throw new HttpException('User does not exist', HttpStatus.BAD_REQUEST,);
    }

    const customer = await this.customerRepository.findOne({ where: {user} });
    if (!customer) {
        throw new HttpException('Customer does not exist', HttpStatus.BAD_REQUEST,);
    }

    customer.name = updatedCustomer.name;
    customer.email = updatedCustomer.email;
    customer.phoneNumber = updatedCustomer.phonenumber;
    customer.address = updatedCustomer.address;
    customer.cart = customer.cart;

    const updated = await this.customerRepository.save(customer);
    return updated;
  }

  public async addCartForCustomer(username: string, cart: Cart): Promise<Customer> {
    const user = await this.userRepository.findOneBy({ username: username });
    if (!user) {
      throw new HttpException('User does not exist', HttpStatus.BAD_REQUEST,);
    }

    const customer = await this.customerRepository.findOneBy({ user: user });
    if (!customer) {
        throw new HttpException('Customer does not exist', HttpStatus.BAD_REQUEST,);
    }

    customer.cart = cart;

    const updated = await this.customerRepository.save(customer);
    return updated;
  }
}
