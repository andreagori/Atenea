import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt'; // Import bcrypt for password hashing

@Injectable()
export class AuthService {
    // This service is responsible for handling authentication logic.
    constructor(private readonly userService: UserService) {}

    // Sign In method to authenticate a user.
    async signIn(username: string, pass: string): Promise<any> {
        const user = await this.userService.findByUsername(username);
        // Verifica si el usuario existe
          // Verifica si el usuario existe
  if (!user) {
    throw new UnauthorizedException('Usuario no encontrado');
  }

  // Verifica que la contraseña no sea undefined o null
  if (!pass || !user.passwordHash) {
    throw new UnauthorizedException('Credenciales inválidas');
  }

  // Compara la contraseña
  const isMatch = await bcrypt.compare(pass, user.passwordHash);
  if (!isMatch) {
    throw new UnauthorizedException('Credenciales incorrectas');
  }
        return 'Firmado correctamente';
    }
}
