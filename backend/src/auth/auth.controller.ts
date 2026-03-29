import { Controller, Post, Body, HttpCode, HttpStatus, Get, UseGuards, Request, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { GoogleAuthGuard } from './google-auth.guard';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { Public } from './public.decorator';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private configService: ConfigService,
    ) { }

    @Post('login')
    @Public()
    @HttpCode(HttpStatus.OK)
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @Post('register')
    @Public()
    async register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    async me(@Request() req) {
        return req.user;
    }

    @Get('google/status')
    @Public()
    getGoogleStatus() {
        const clientId = this.configService.get<string>('GOOGLE_CLIENT_ID');
        const clientSecret = this.configService.get<string>('GOOGLE_CLIENT_SECRET');

        return {
            enabled: Boolean(clientId && clientSecret),
            loginUrl: '/auth/google',
        };
    }

    @Get('google')
    @Public()
    @UseGuards(GoogleAuthGuard)
    async googleAuth() {
        return;
    }

    @Get('google/callback')
    @Public()
    @UseGuards(GoogleAuthGuard)
    async googleAuthCallback(@Request() req, @Res() res: Response) {
        const frontendUrl = this.getFrontendUrl();
        const redirectUrl = new URL(frontendUrl);
        redirectUrl.pathname = `${redirectUrl.pathname.replace(/\/$/, '')}/auth/callback`;
        redirectUrl.search = '';
        redirectUrl.hash = '';

        if (!req.user?.access_token || !req.user?.user) {
            redirectUrl.searchParams.set('error', 'google_auth_failed');
            return res.redirect(redirectUrl.toString());
        }

        redirectUrl.searchParams.set('token', req.user.access_token);
        redirectUrl.searchParams.set('user', JSON.stringify(req.user.user));

        return res.redirect(redirectUrl.toString());
    }

    private getFrontendUrl(): string {
        const configuredFrontendUrl = this.configService.get<string>('FRONTEND_URL');
        if (configuredFrontendUrl) {
            return configuredFrontendUrl;
        }

        const corsOrigin = this.configService.get<string>('CORS_ORIGIN');
        if (corsOrigin) {
            const firstOrigin = corsOrigin
                .split(',')
                .map((origin) => origin.trim())
                .find(Boolean);

            if (firstOrigin) {
                return firstOrigin;
            }
        }

        return 'http://localhost:3000';
    }
}
