import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Profile } from 'passport-google-oauth20';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    private normalizeEmail(email: string) {
        return email.trim().toLowerCase();
    }

    private normalizeUsername(username: string) {
        return username.trim().replace(/\s+/g, ' ');
    }

    private buildAuthResponse(user: {
        id: string;
        username: string;
        email: string;
        role: string;
        createdAt?: Date;
        updatedAt?: Date;
    }) {
        const payload = {
            sub: user.id,
            email: user.email,
            username: user.username,
            role: user.role,
        };

        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
        };
    }

    async login(loginDto: LoginDto) {
        const email = this.normalizeEmail(loginDto.email);
        const { password } = loginDto;

        const user = await this.usersService.findByEmail(email);
        if (!user) {
            throw new UnauthorizedException('Credenciais invalidas');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Credenciais invalidas');
        }

        return this.buildAuthResponse(user);
    }

    async register(registerDto: RegisterDto) {
        const hashedPassword = await bcrypt.hash(registerDto.password, 12);

        const user = await this.usersService.create({
            username: this.normalizeUsername(registerDto.username),
            email: this.normalizeEmail(registerDto.email),
            password: hashedPassword,
            role: 'ANALYST',
        });

        return this.buildAuthResponse(user);
    }

    async loginWithGoogle(profile: Profile) {
        const email = this.normalizeEmail(profile.emails?.[0]?.value || '');
        if (!email) {
            throw new UnauthorizedException('Conta Google sem email disponivel');
        }

        const existingUser = await this.usersService.findByEmail(email);
        if (existingUser) {
            return this.buildAuthResponse(existingUser);
        }

        const baseUsername = this.normalizeUsername(
            profile.displayName || email.split('@')[0] || 'usuario'
        );
        const username = await this.generateUniqueUsername(baseUsername);
        const randomPasswordHash = await bcrypt.hash(`${profile.id}-${Date.now()}`, 12);

        const user = await this.usersService.create({
            username,
            email,
            password: randomPasswordHash,
            role: 'ANALYST',
        });

        return this.buildAuthResponse(user);
    }

    private async generateUniqueUsername(baseUsername: string) {
        const fallbackBase = baseUsername || 'usuario';
        let candidate = fallbackBase;
        let counter = 1;

        while (await this.usersService.findByUsername(candidate)) {
            counter += 1;
            candidate = `${fallbackBase} ${counter}`;
        }

        return candidate;
    }

    async validateUser(payload: any) {
        return await this.usersService.findById(payload.sub);
    }
}
