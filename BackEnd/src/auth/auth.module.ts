import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { JwtStrategy } from 'src/jwt/jwt.strategy';

@Module({
  imports: [
    UserModule,
  JwtModule.register({
    global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1d' }, // Token expiration time
    }),],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
