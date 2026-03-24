import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SupabaseService } from '../supabase/supabase.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FilesService {
    constructor(
        private prisma: PrismaService,
        private supabaseService: SupabaseService,
    ) { }

    async uploadFile(file: Express.Multer.File, uploadedById: string) {
        const fileName = `${uuidv4()}-${file.originalname}`;

        if (!file.buffer) {
            throw new Error('Arquivo invalido para upload em memoria');
        }

        await this.supabaseService.uploadFile(
            'uploads',
            fileName,
            file.buffer,
            file.mimetype
        );

        return this.prisma.fileUpload.create({
            data: {
                filename: fileName,
                originalName: file.originalname,
                mimetype: file.mimetype,
                size: file.size,
                path: `uploads/${fileName}`,
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
        const data = await this.supabaseService.downloadFile('uploads', file.filename);

        return {
            data,
            filename: file.originalName,
            mimetype: file.mimetype,
        };
    }

    async remove(id: string) {
        const file = await this.findOne(id);

        await this.supabaseService.deleteFile('uploads', file.filename);

        return this.prisma.fileUpload.delete({
            where: { id },
        });
    }

    getFilePublicUrl(filename: string) {
        return this.supabaseService.getPublicUrl('uploads', filename);
    }
}
