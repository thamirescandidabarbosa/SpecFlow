import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from '../auth/dto/register.dto';
import { UpdateUserProfileDto, ChangePasswordDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async create(userData: RegisterDto) {
        // Verificar se o email já existe
        const existingUser = await this.prisma.user.findUnique({
            where: { email: userData.email },
        });

        if (existingUser) {
            throw new ConflictException('Email já está em uso');
        }

        // Verificar se o username já existe
        const existingUsername = await this.prisma.user.findUnique({
            where: { username: userData.username },
        });

        if (existingUsername) {
            throw new ConflictException('Nome de usuário já está em uso');
        }

        const user = await this.prisma.user.create({
            data: {
                username: userData.username,
                email: userData.email,
                password: userData.password,
                role: userData.role || 'ANALYST',
            },
        });

        // Remover senha do retorno
        const { password, ...result } = user;
        return result;
    }

    async findByEmail(email: string) {
        return this.prisma.user.findUnique({
            where: { email },
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
            throw new NotFoundException('Usuário não encontrado');
        }

        return user;
    }

    async updateProfile(id: string, updateData: UpdateUserProfileDto) {
        const user = await this.findOne(id);

        // Verificar se o email já está em uso por outro usuário
        if (updateData.email && updateData.email !== user.email) {
            const existingUser = await this.prisma.user.findUnique({
                where: { email: updateData.email },
            });

            if (existingUser && existingUser.id !== id) {
                throw new ConflictException('Email já está em uso por outro usuário');
            }
        }

        // Verificar se o username já está em uso por outro usuário
        if (updateData.username && updateData.username !== user.username) {
            const existingUsername = await this.prisma.user.findUnique({
                where: { username: updateData.username },
            });

            if (existingUsername && existingUsername.id !== id) {
                throw new ConflictException('Nome de usuário já está em uso por outro usuário');
            }
        }

        const updatedUser = await this.prisma.user.update({
            where: { id },
            data: updateData,
        });

        // Remover senha do retorno
        const { password, ...result } = updatedUser;
        return result;
    }

    async changePassword(id: string, changePasswordData: ChangePasswordDto) {
        const user = await this.findOne(id);

        // Verificar se a senha atual está correta
        const isCurrentPasswordValid = await bcrypt.compare(
            changePasswordData.currentPassword,
            user.password
        );

        if (!isCurrentPasswordValid) {
            throw new BadRequestException('Senha atual incorreta');
        }

        // Hash da nova senha
        const hashedNewPassword = await bcrypt.hash(changePasswordData.newPassword, 10);

        await this.prisma.user.update({
            where: { id },
            data: { password: hashedNewPassword },
        });

        return { message: 'Senha alterada com sucesso' };
    }
}
