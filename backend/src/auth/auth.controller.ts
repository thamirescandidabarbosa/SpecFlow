import { Controller, Post, Body, HttpCode, HttpStatus, Get, UseGuards, Request, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { GoogleAuthGuard } from './google-auth.guard';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private configService: ConfigService,
    ) { }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @Post('register')
    async register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    async me(@Request() req) {
        return req.user;
    }

    @Get('google')
    @UseGuards(GoogleAuthGuard)
    async googleAuth() {
        return;
    }

    @Get('google/callback')
    @UseGuards(GoogleAuthGuard)
    async googleAuthCallback(@Request() req, @Res() res: Response) {
        const frontendUrl =
            this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
        const redirectUrl = new URL(frontendUrl);
        redirectUrl.pathname = `${redirectUrl.pathname.replace(/\/$/, '')}/auth/callback`;
        redirectUrl.search = '';
        redirectUrl.hash = '';

        redirectUrl.searchParams.set('token', req.user.access_token);
        redirectUrl.searchParams.set('user', JSON.stringify(req.user.user));

        return res.redirect(redirectUrl.toString());
    }
}
