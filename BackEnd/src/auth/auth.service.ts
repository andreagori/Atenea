import * as bcrypt from 'bcrypt'; // Import bcrypt for password hashing
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    // This service is responsible for handling authentication logic.
    constructor(
      private readonly userService: UserService,
      private readonly jwtService: JwtService, // Injecting JwtService for JWT token generation
    ) {}

    // SIGN UP method to register a new user.
    async signUp(username: string, password: string) {
      const user = await this.userService.create({
        username,
        password, // Envía el hash
      });
      return user;
    }

    // Sign In method to authenticate a user.
    async signIn(username: string, pass: string): Promise<any> {
        const user = await this.userService.findByUsername(username);
        // Compara la contraseña
        const isMatch = await bcrypt.compare(pass, user?.passwordHash);
        if (!isMatch) 
        {
          throw new UnauthorizedException('Credenciales incorrectas');
        }
        // Generate JWT token if credentials are valid ----
        const payload = { sub: user?.userId, username: user?.username };
        return {
          access_token: await this.jwtService.signAsync(payload),
        };
    }
}
