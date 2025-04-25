import { Body, Controller, HttpCode, HttpStatus, Post, Get, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { AuthGuard } from './auth.guard';


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

    // This route is protected by the AuthGuard
    @UseGuards(AuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }
}
