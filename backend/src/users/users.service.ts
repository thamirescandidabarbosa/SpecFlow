import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserProfileDto, ChangePasswordDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';

interface CreateUserInput {
    username: string;
    email: string;
    password: string;
    role?: 'ADMIN' | 'ANALYST' | 'USER';
}

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async create(userData: CreateUserInput) {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: userData.email },
        });

        if (existingUser) {
            throw new ConflictException('Email ja esta em uso');
        }

        const existingUsername = await this.prisma.user.findUnique({
            where: { username: userData.username },
        });

        if (existingUsername) {
            throw new ConflictException('Nome de usuario ja esta em uso');
        }

        const user = await this.prisma.user.create({
            data: {
                username: userData.username,
                email: userData.email,
                password: userData.password,
                role: userData.role || 'ANALYST',
            },
        });

        const { password, ...result } = user;
        return result;
    }

    async findByEmail(email: string) {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }

    async findByUsername(username: string) {
        return this.prisma.user.findUnique({
            where: { username },
        });
    }

    async findById(id: string) {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });

        if (user) {
            const { password, ...result } = user;
            return result;
        }

        return null;
    }

    async findAll() {
        const users = await this.prisma.user.findMany({
            select: {
                id: true,
                username: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        return users;
    }

    async findOne(id: string) {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });

        if (!user) {
            throw new NotFoundException('Usuario nao encontrado');
        }

        return user;
    }

    async updateProfile(id: string, updateData: UpdateUserProfileDto) {
        const user = await this.findOne(id);

        if (updateData.email && updateData.email !== user.email) {
            const existingUser = await this.prisma.user.findUnique({
                where: { email: updateData.email },
            });

            if (existingUser && existingUser.id !== id) {
                throw new ConflictException('Email ja esta em uso por outro usuario');
            }
        }

        if (updateData.username && updateData.username !== user.username) {
            const existingUsername = await this.prisma.user.findUnique({
                where: { username: updateData.username },
            });

            if (existingUsername && existingUsername.id !== id) {
                throw new ConflictException('Nome de usuario ja esta em uso por outro usuario');
            }
        }

        const updatedUser = await this.prisma.user.update({
            where: { id },
            data: updateData,
        });

        const { password, ...result } = updatedUser;
        return result;
    }

    async changePassword(id: string, changePasswordData: ChangePasswordDto) {
        const user = await this.findOne(id);

        const isCurrentPasswordValid = await bcrypt.compare(
            changePasswordData.currentPassword,
            user.password
        );

        if (!isCurrentPasswordValid) {
            throw new BadRequestException('Senha atual incorreta');
        }

        const hashedNewPassword = await bcrypt.hash(changePasswordData.newPassword, 12);

        await this.prisma.user.update({
            where: { id },
            data: { password: hashedNewPassword },
        });

        return { message: 'Senha alterada com sucesso' };
    }
}
