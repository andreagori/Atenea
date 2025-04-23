import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';

@Controller('auth')
export class AuthController {
    // This controller handles authentication routes.
    constructor(private readonly authService: AuthService) {}

    // Http status codes:
    @HttpCode(HttpStatus.OK)
    @Post('sign-in')
    async signIn(@Body() SignInDto: SignInDto) {
        return this.authService.signIn(SignInDto.username, SignInDto.passwordHash);
    }
    
}
