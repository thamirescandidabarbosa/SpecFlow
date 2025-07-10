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
    Query,
    BadRequestException,
    Res,
    NotFoundException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Response } from 'express';
import { createReadStream, existsSync } from 'fs';
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
                destination: './uploads',
                filename: (req, file, callback) => {
                    const uniqueSuffix = uuidv4();
                    const ext = extname(file.originalname);
                    const filename = `${uniqueSuffix}${ext}`;
                    callback(null, filename);
                },
            }),
            fileFilter: (req, file, callback) => {
                // Permitir imagens, PDFs e documentos Word
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

                const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.pdf', '.doc', '.docx', '.txt', '.xls', '.xlsx'];
                const fileExtension = extname(file.originalname).toLowerCase();

                if (allowedMimes.includes(file.mimetype) || allowedExtensions.includes(fileExtension)) {
                    callback(null, true);
                } else {
                    callback(new Error(`Tipo de arquivo não permitido: ${file.mimetype} (${fileExtension})`), false);
                }
            },
            limits: {
                fileSize: 10 * 1024 * 1024, // 10MB
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

    @Get('serve/:filename')
    async serveFile(@Param('filename') filename: string, @Res() res: Response) {
        const filePath = join(process.cwd(), 'uploads', filename);
        
        if (!existsSync(filePath)) {
            throw new NotFoundException('Arquivo não encontrado');
        }

        const file = createReadStream(filePath);
        
        // Determinar o tipo de conteúdo baseado na extensão
        const ext = extname(filename).toLowerCase();
        let contentType = 'application/octet-stream';
        
        switch (ext) {
            case '.jpg':
            case '.jpeg':
                contentType = 'image/jpeg';
                break;
            case '.png':
                contentType = 'image/png';
                break;
            case '.gif':
                contentType = 'image/gif';
                break;
            case '.pdf':
                contentType = 'application/pdf';
                break;
        }

        res.set({
            'Content-Type': contentType,
            'Cache-Control': 'public, max-age=3600',
        });

        file.pipe(res);
    }
}
