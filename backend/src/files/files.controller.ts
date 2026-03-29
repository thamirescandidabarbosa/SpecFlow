import {
    Controller,
    Get,
    Post,
    Param,
    Delete,
    UseGuards,
    UseInterceptors,
    UploadedFile,
    Request,
    BadRequestException,
    Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { existsSync, mkdirSync } from 'fs';
import { extname } from 'path';
import { Response } from 'express';
import { FilesService } from './files.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('files')
@UseGuards(JwtAuthGuard)
export class FilesController {
    constructor(private filesService: FilesService) { }

    @Post('upload')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: (req, file, callback) => {
                    const destination = 'uploads/files';
                    if (!existsSync(destination)) {
                        mkdirSync(destination, { recursive: true });
                    }
                    callback(null, destination);
                },
                filename: (req, file, callback) => {
                    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
                    callback(null, `${uniqueSuffix}${extname(file.originalname)}`);
                },
            }),
            fileFilter: (req, file, callback) => {
                const allowedMimes = [
                    'image/jpeg',
                    'image/jpg',
                    'image/png',
                    'image/gif',
                    'application/pdf',
                    'application/msword',
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    'text/plain',
                    'application/vnd.ms-excel',
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                ];

                const fileName = file.originalname.toLowerCase();
                const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.pdf', '.doc', '.docx', '.txt', '.xls', '.xlsx'];
                const isAllowedExtension = allowedExtensions.some((extension) => fileName.endsWith(extension));

                if (allowedMimes.includes(file.mimetype) || isAllowedExtension) {
                    callback(null, true);
                } else {
                    callback(new Error(`Tipo de arquivo nao permitido: ${file.mimetype}`), false);
                }
            },
            limits: {
                fileSize: 10 * 1024 * 1024,
            },
        }),
    )
    async uploadFile(
        @UploadedFile() file: Express.Multer.File,
        @Request() req,
    ) {
        if (!file) {
            throw new BadRequestException('Nenhum arquivo foi enviado');
        }

        return this.filesService.uploadFile(file, req.user.id);
    }

    @Get()
    findAll() {
        return this.filesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.filesService.findOne(id);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.filesService.remove(id);
    }

    @Get(':id/download')
    async download(@Param('id') id: string, @Res() res: Response) {
        const file = await this.filesService.downloadFile(id);

        res.setHeader('Content-Type', file.mimetype);
        res.setHeader('Content-Disposition', `attachment; filename="${file.filename}"`);
        file.data.pipe(res);
    }
}
