import { Body, Controller, HttpCode, HttpStatus, Post, Get, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';


@Controller('auth')
export class AuthController {
    // This controller handles authentication routes.
    constructor(private readonly authService: AuthService) {}

    // Sign Up route to register a new user. -----
    @HttpCode(HttpStatus.OK)
    @Post('sign-up')
    async signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto.username, signUpDto.password);
    }

    // Http status codes:
    @HttpCode(HttpStatus.OK)
    @Post('sign-in')
    async signIn(@Body() SignInDto: SignInDto) {
        return this.authService.signIn(SignInDto.username, SignInDto.password);
    }

    // This route is protected by the AuthGuard
    @UseGuards(AuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }
}
