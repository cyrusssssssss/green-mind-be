import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { UserModule } from '../user/user.module';
import { AuthenticationController } from './authentication.controller';
import { JwtModule } from '@nestjs/jwt';
import { CustomerModule } from '../customer/customer.module';
import { LocalStrategy } from './strategy/local.strategy';
import { CartModule } from '../cart/cart.module';
// import { LocalStrategy } from './strategy/local.strategy';
// import { JwtStrategy } from './strategy/jwt.strategy';


// const JWT_SECRET = process.env.JWT_SECRET;
// const JWT_SECRET_EXPIRED = process.env.JWT_SECRET_EXPIRED;

@Module({
  imports: [
    UserModule,
    CustomerModule,
    CartModule,
    JwtModule.registerAsync({
      global: true,
      useFactory: async () => ({
        secret: "nhung101",
        signOptions: {
          expiresIn: "1h",
        },
      }),
    }),
  ],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, LocalStrategy],
  exports: [AuthenticationService],
})
export class AuthenticationModule {}
