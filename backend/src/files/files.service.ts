import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { createReadStream, existsSync, unlinkSync } from 'fs';

@Injectable()
export class FilesService {
    constructor(private prisma: PrismaService) { }

    async uploadFile(file: Express.Multer.File, uploadedById: string) {
        if (!file.filename || !file.path) {
            throw new Error('Arquivo invalido para upload local');
        }

        return this.prisma.fileUpload.create({
            data: {
                filename: file.filename,
                originalName: file.originalname,
                mimetype: file.mimetype,
                size: file.size,
                path: file.path.replace(/\\/g, '/'),
                uploadedById,
            },
        });
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
        const file = await this.prisma.fileUpload.findUnique({
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

        if (!file) {
            throw new NotFoundException('Arquivo nao encontrado');
        }

        return file;
    }

    async downloadFile(id: string) {
        const file = await this.findOne(id);
        if (!existsSync(file.path)) {
            throw new NotFoundException('Arquivo nao encontrado no armazenamento local');
        }

        return {
            data: createReadStream(file.path),
            filename: file.originalName,
            mimetype: file.mimetype,
        };
    }

    async remove(id: string) {
        const file = await this.findOne(id);
        if (existsSync(file.path)) {
            unlinkSync(file.path);
        }

        return this.prisma.fileUpload.delete({
            where: { id },
        });
    }

    getFilePublicUrl(filename: string) {
        return `/uploads/files/${filename}`;
    }
}
