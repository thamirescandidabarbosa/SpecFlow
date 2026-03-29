import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { AuthService } from './auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(
        configService: ConfigService,
        private readonly authService: AuthService,
    ) {
        super({
            clientID: configService.get<string>('GOOGLE_CLIENT_ID') || 'disabled',
            clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET') || 'disabled',
            callbackURL:
                configService.get<string>('GOOGLE_CALLBACK_URL') ||
                `${(configService.get<string>('PUBLIC_API_URL') || configService.get<string>('BACKEND_PUBLIC_URL') || 'http://localhost:3001/api').replace(/\/$/, '')}/auth/google/callback`,
            scope: ['email', 'profile'],
        });
    }

    async validate(
        _accessToken: string,
        _refreshToken: string,
        profile: Profile,
    ) {
        if (!profile.emails?.[0]?.value) {
            throw new UnauthorizedException('Conta Google sem email disponivel');
        }

        return this.authService.loginWithGoogle(profile);
    }
}
