import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entity/user.entity';
import { Admin } from './entity/admin.entity';
@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}



  public async getAdminByUsername(
    username: string,
  ): Promise<Admin | undefined> {
    return this.adminRepository
      .createQueryBuilder('admin')
      .innerJoinAndSelect('admin.user', 'user')
      .where('user.username = :username', { username })
      .getOne();
  }
}
