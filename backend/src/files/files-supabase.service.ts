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
        // Generate unique filename
        const fileName = `${uuidv4()}-${file.originalname}`;
        
        try {
            // Upload to Supabase Storage
            await this.supabaseService.uploadFile(
                'uploads', // bucket name
                fileName,
                file.buffer,
                file.mimetype
            );

            // Save file metadata to database
            const fileRecord = await this.prisma.fileUpload.create({
                data: {
                    filename: fileName,
                    originalName: file.originalname,
                    mimetype: file.mimetype,
                    size: file.size,
                    path: `uploads/${fileName}`, // Supabase path
                    uploadedById,
                },
            });

            return fileRecord;
        } catch (error) {
            throw new Error(`Erro ao fazer upload do arquivo: ${error.message}`);
        }
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
            throw new NotFoundException('Arquivo não encontrado');
        }

        return file;
    }

    async downloadFile(id: string) {
        const file = await this.findOne(id);
        
        try {
            // Download from Supabase Storage
            const data = await this.supabaseService.downloadFile('uploads', file.filename);
            
            return {
                data,
                filename: file.originalName,
                mimetype: file.mimetype,
            };
        } catch (error) {
            throw new Error(`Erro ao baixar arquivo: ${error.message}`);
        }
    }

    async remove(id: string) {
        const file = await this.findOne(id);
        
        try {
            // Delete from Supabase Storage
            await this.supabaseService.deleteFile('uploads', file.filename);
            
            // Delete from database
            await this.prisma.fileUpload.delete({
                where: { id },
            });

            return { message: 'Arquivo deletado com sucesso' };
        } catch (error) {
            throw new Error(`Erro ao deletar arquivo: ${error.message}`);
        }
    }

    async findFilesBySpecification(specificationId: string) {
        return this.prisma.fileUpload.findMany({
            where: {
                functionalSpecificationId: specificationId,
            },
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
}
