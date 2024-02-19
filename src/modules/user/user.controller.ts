import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entity/user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() user: User): Promise<User> {
    return this.userService.createUser(user);
  }

  @Get(':id')
  async findUserById(@Param('id') id: number): Promise<User | undefined> {
    return this.userService.findUserById(id);
  }

  @Get()
  async getAllUsernames() {
    const usernames = await this.userService.getAllUsernames();
    return usernames;
  }
}