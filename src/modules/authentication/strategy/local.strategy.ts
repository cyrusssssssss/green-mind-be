import { AuthenticationService } from './../authentication.service';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { User } from 'src/modules/user/entity/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authenticationService: AuthenticationService) {
    super({
      usernameField: 'username',// tim theo username
    });
  }
  async validate(username: string, password: string): Promise<User> {
    console.log(1);
    
    return await this.authenticationService.getAuthenticationUser(
      username,
      password,
    );
  }
}
