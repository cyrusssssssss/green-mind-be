import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/modules/user/user.service';

const JWT_SECRET = process.env.JWT_SECRET;
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly userservice: UserService) {
    super({
      secretOrKey: "nhung101",
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }
  async validate(payload: TokenPayload) {
    return this.userservice.getUserByUsername(payload.username);
  }
}
