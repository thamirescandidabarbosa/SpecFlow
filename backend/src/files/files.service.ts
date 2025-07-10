import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FilesService {
    constructor(private prisma: PrismaService) { }

    async uploadFile(file: Express.Multer.File, uploadedById: string) {
        const fileRecord = await this.prisma.fileUpload.create({
            data: {
                filename: file.filename,
                originalName: file.originalname,
                mimetype: file.mimetype,
                size: file.size,
                path: file.path,
                uploadedById,
            },
        });

        return fileRecord;
    }

    async findAll() {
        return this.prisma.fileUpload.findMany({
            include: {
                uploadedBy: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    async findOne(id: string) {
        return this.prisma.fileUpload.findUnique({
            where: { id },
            include: {
                uploadedBy: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                    },
                },
            },
        });
    }

    async remove(id: string) {
        const file = await this.prisma.fileUpload.findUnique({
            where: { id },
        });

        if (file) {
            // Remover arquivo do sistema de arquivos
            try {
                fs.unlinkSync(file.path);
            } catch (error) {
                console.error('Erro ao remover arquivo:', error);
            }

            // Remover registro do banco
            return this.prisma.fileUpload.delete({
                where: { id },
            });
        }

        return null;
    }
}
