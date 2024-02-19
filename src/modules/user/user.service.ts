import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createUser(user: User): Promise<User> {
    return this.userRepository.save(user);
  }

  async findUserById(id: number): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { id } });
  }

  public async getUserByUsername(username: string) {
    const user = await this.userRepository.findOneBy({ username: username });

    return user;
  }
  public async getPasswordByUsername(username: string) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.username=:username', { username })
      .getOne();
    return user.password;
  }

  public async getUserIfRefreshTokenMatch(
    refreshToken: string,
    username: string,
  ) {
    const user = await this.getUserByUsername(username);
    const ifRefreshTokenMatch = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );
    if (ifRefreshTokenMatch) {
      user.refreshToken = undefined;
      return user;
    } else throw new UnauthorizedException('refresh token khong hop le');
  }

  public async setCurrentRefreshToken(refreshtoken: string, username: string) {
    const currentHashedRefreshToken = await bcrypt.hash(refreshtoken, 10);
    const user = await this.getUserByUsername(username);
    await this.userRepository.update(user.id, {
      refreshToken: currentHashedRefreshToken,
    });
  }
  
  public async getRoleByUserName(username:string)
  {
    const user = await this.userRepository.findOneBy({username})
    return user.role
  }

  public async getAllUsernames() {
    try {
      const users = await this.userRepository.find();
      const usernames = [];
      users.map( user => {
        usernames.push(user.username);
      });
      return usernames;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
