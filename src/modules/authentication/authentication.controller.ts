import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { NewUserDTO, Login } from './dto/newUser.dto';
import { AuthenticationService } from './authentication.service';
// import RequestWithUser from './Interface/RequestWithUser.interface';
import { UserService } from '../user/user.service';
import { LocalAuthenticationGuard } from 'src/guard/localAuthentication.guard';

@Controller()
export class AuthenticationController {
  constructor(
    private readonly authenticationservice: AuthenticationService,
    private readonly userService: UserService,
  ) {}
  @Post('/signup')
  async register(@Body() newUserDto: NewUserDTO) {
    console.log(newUserDto);

    const data =  this.authenticationservice.register(newUserDto);
    return new HttpException({ data }, HttpStatus.CREATED);
  }
  @UseGuards(LocalAuthenticationGuard) // check username va password
  @Post('login')
  async login(@Body() user: Login) {
    const accessToekn = await this.authenticationservice.getJWTToken(
      user.username,
    );
    const refreshToken = await this.authenticationservice.getJWTRefreshToken(
      user.username,
    );
    const role = await this.userService.getRoleByUserName(user.username);
    await this.userService.setCurrentRefreshToken(refreshToken, user.username);
    const data = [
      {
        accessToken: accessToekn,
        refreshToken: refreshToken,
        role: role,
      },
    ];
    return new HttpException({ message: 'login success', data }, HttpStatus.OK);
  }

}
