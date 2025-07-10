import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Request,
    UseInterceptors,
    UploadedFiles,
    UploadedFile,
    BadRequestException,
    ForbiddenException,
    Res,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as path from 'path';
import * as fs from 'fs';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Public } from '../auth/public.decorator';
import { EfService } from './ef.service';
import { SimplePdfGeneratorService } from './simple-pdf-generator.service';
import { UltraSimplePdfGeneratorService } from './ultra-simple-pdf-generator.service';
import { CompatiblePdfGeneratorService } from './compatible-pdf-generator.service';
import { CreateFunctionalSpecificationDto } from './dto/create-ef.dto';
import { UpdateFunctionalSpecificationDto } from './dto/update-ef.dto';

// Configuração do Multer para upload
const multerConfig = {
    storage: diskStorage({
        destination: './uploads/ef',
        filename: (req, file, cb) => {
            const randomName = Array(32)
                .fill(null)
                .map(() => Math.round(Math.random() * 16).toString(16))
                .join('');
            cb(null, `${randomName}${extname(file.originalname)}`);
        },
    }),
    fileFilter: (req, file, cb) => {
        // Tipos MIME permitidos
        const allowedMimeTypes = [
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
        
        // Extensões permitidas
        const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.pdf', '.doc', '.docx', '.txt', '.xls', '.xlsx'];
        const fileExtension = extname(file.originalname).toLowerCase();
        
        const isMimeTypeValid = allowedMimeTypes.includes(file.mimetype);
        const isExtensionValid = allowedExtensions.includes(fileExtension);

        if (isMimeTypeValid || isExtensionValid) {
            return cb(null, true);
        } else {
            cb(new BadRequestException(`Tipo de arquivo não permitido: ${file.mimetype} (${fileExtension})`), false);
        }
    },
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
    },
};

@Controller('ef')
@UseGuards(JwtAuthGuard)
export class EfController {
    constructor(
        private readonly efService: EfService,
        private readonly simplePdfGeneratorService: SimplePdfGeneratorService, // Usando serviço simples de PDF
        private readonly ultraSimplePdfGeneratorService: UltraSimplePdfGeneratorService, // Usando serviço ultra simples para teste
        private readonly compatiblePdfGeneratorService: CompatiblePdfGeneratorService // Usando serviço compatível
    ) { }

    @Post()
    async create(@Body() createEfDto: CreateFunctionalSpecificationDto, @Request() req) {
        try {
            console.log('Dados recebidos:', JSON.stringify(createEfDto, null, 2));
            console.log('User ID:', req.user?.id);

            return await this.efService.create(createEfDto, req.user.id);
        } catch (error) {
            console.error('Erro ao criar EF:', error);
            throw error;
        }
    }

    @Get()
    findAll() {
        return this.efService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.efService.findOne(id);
    }

    @Get(':id/can-edit')
    async canEdit(@Param('id') id: string, @Request() req) {
        try {
            await this.efService.verifyEditPermission(id, req.user.id);
            return { canEdit: true };
        } catch (error) {
            if (error instanceof ForbiddenException) {
                return { canEdit: false, message: error.message };
            }
            throw error;
        }
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateEfDto: UpdateFunctionalSpecificationDto, @Request() req) {
        try {
            // Verificar se o usuário tem permissão para editar
            await this.efService.verifyEditPermission(id, req.user.id);

            return await this.efService.update(id, updateEfDto);
        } catch (error) {
            console.error('Erro ao atualizar EF:', error);
            throw error;
        }
    }

    @Delete(':id')
    async remove(@Param('id') id: string, @Request() req) {
        try {
            // Verificar se o usuário tem permissão para deletar
            await this.efService.verifyEditPermission(id, req.user.id);

            return await this.efService.remove(id);
        } catch (error) {
            console.error('Erro ao deletar EF:', error);
            throw error;
        }
    }

    @Post(':id/upload/process-diagram')
    @UseInterceptors(FileInterceptor('file', multerConfig))
    uploadProcessDiagram(@Param('id') id: string, @UploadedFile() file: Express.Multer.File, @Request() req) {
        if (!file) {
            throw new BadRequestException('Nenhum arquivo foi enviado');
        }
        return this.efService.uploadFiles(id, [file], 'process-diagram', req.user.id);
    }

    @Post(':id/upload/unit-tests')
    @UseInterceptors(FilesInterceptor('files', 10, multerConfig))
    uploadUnitTests(@Param('id') id: string, @UploadedFiles() files: Express.Multer.File[], @Request() req) {
        if (!files || files.length === 0) {
            throw new BadRequestException('Nenhum arquivo foi enviado');
        }
        return this.efService.uploadFiles(id, files, 'unit-tests', req.user.id);
    }

    @Post(':id/upload')
    @UseInterceptors(FilesInterceptor('files', 10, multerConfig))
    uploadAttachments(@Param('id') id: string, @UploadedFiles() files: Express.Multer.File[], @Request() req) {
        if (!files || files.length === 0) {
            throw new BadRequestException('Nenhum arquivo foi enviado');
        }
        return this.efService.uploadFiles(id, files, 'attachments', req.user.id);
    }

    @Get('file/:fileId')
    async downloadFile(@Param('fileId') fileId: string, @Res() res: Response) {
        try {
            const file = await this.efService.getFileById(fileId);
            
            if (!file) {
                return res.status(404).json({ error: 'Arquivo não encontrado' });
            }

            const filePath = path.join('./uploads/ef', file.filename);
            
            if (!fs.existsSync(filePath)) {
                return res.status(404).json({ error: 'Arquivo não encontrado no sistema de arquivos' });
            }

            // Configurar headers para download
            res.setHeader('Content-Type', file.mimetype);
            res.setHeader('Content-Disposition', `attachment; filename="${file.originalName}"`);
            
            // Enviar arquivo
            res.sendFile(path.resolve(filePath));
        } catch (error) {
            console.error('Erro ao baixar arquivo:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    @Get('file/:fileId/view')
    async viewFile(@Param('fileId') fileId: string, @Res() res: Response) {
        try {
            const file = await this.efService.getFileById(fileId);
            
            if (!file) {
                return res.status(404).json({ error: 'Arquivo não encontrado' });
            }

            const filePath = path.join('./uploads/ef', file.filename);
            
            if (!fs.existsSync(filePath)) {
                return res.status(404).json({ error: 'Arquivo não encontrado no sistema de arquivos' });
            }

            // Configurar headers para visualização inline (não download)
            res.setHeader('Content-Type', file.mimetype);
            res.setHeader('Content-Disposition', `inline; filename="${file.originalName}"`);
            
            // Enviar arquivo
            res.sendFile(path.resolve(filePath));
        } catch (error) {
            console.error('Erro ao visualizar arquivo:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    @Get(':id/generate-pdf')
    async generatePdf(@Param('id') id: string, @Res() res: Response) {
        try {
            const ef = await this.efService.findOne(id);

            // Gerar PDF usando o serviço compatível (com require())
            const pdfBuffer = await this.compatiblePdfGeneratorService.generateEfPdf(ef);

            // Configurar headers para download do PDF
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="EF_${ef.cardNumber}_${new Date().toISOString().split('T')[0]}.pdf"`);
            res.setHeader('Content-Length', pdfBuffer.length);

            // Enviar o PDF
            res.send(pdfBuffer);
        } catch (error) {
            console.error('Erro ao gerar PDF:', error);
            res.status(500).json({
                error: 'Erro interno do servidor ao gerar PDF',
                message: error.message
            });
        }
    }

    @Get(':id/pdf')
    async getPdf(@Param('id') id: string, @Res() res: Response) {
        try {
            const ef = await this.efService.findOne(id);

            // Gerar PDF usando o serviço ultra simples para teste
            const pdfBuffer = await this.ultraSimplePdfGeneratorService.generateEfPdf(ef);

            // Configurar headers para download do PDF
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="EF_${ef.cardNumber}_${new Date().toISOString().split('T')[0]}.pdf"`);
            res.setHeader('Content-Length', pdfBuffer.length);

            // Enviar o PDF
            res.send(pdfBuffer);
        } catch (error) {
            console.error('Erro ao gerar PDF:', error);
            res.status(500).json({
                error: 'Erro interno do servidor ao gerar PDF',
                message: error.message
            });
        }
    }

    @Get(':id/generate-json')
    async generateJson(@Param('id') id: string, @Res() res: Response) {
        const ef = await this.efService.findOne(id);

        const jsonData = {
            title: `Especificação Funcional - ${ef.cardNumber}`,
            data: ef,
            generated: new Date().toISOString(),
        };

        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename="EF_${ef.cardNumber}.json"`);

        return res.json(jsonData);
    }

    @Public()
    @Get('public/file/:fileId/:token')
    async downloadFilePublic(@Param('fileId') fileId: string, @Param('token') token: string, @Res() res: Response) {
        try {
            // Verificar se o token é válido (simples verificação por enquanto)
            const expectedToken = this.generateFileToken(fileId);
            
            if (token !== expectedToken) {
                return res.status(401).json({ error: 'Token inválido' });
            }

            const file = await this.efService.getFileById(fileId);
            
            if (!file) {
                return res.status(404).json({ error: 'Arquivo não encontrado' });
            }

            const filePath = path.join('./uploads/ef', file.filename);
            
            if (!fs.existsSync(filePath)) {
                return res.status(404).json({ error: 'Arquivo não encontrado no sistema de arquivos' });
            }

            // Configurar headers para download
            res.setHeader('Content-Type', file.mimetype);
            res.setHeader('Content-Disposition', `attachment; filename="${file.originalName}"`);
            
            // Enviar arquivo
            res.sendFile(path.resolve(filePath));
        } catch (error) {
            console.error('Erro ao baixar arquivo público:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    @Public()
    @Get('public/file/:fileId/:token/view')
    async viewFilePublic(@Param('fileId') fileId: string, @Param('token') token: string, @Res() res: Response) {
        try {
            // Verificar se o token é válido
            const expectedToken = this.generateFileToken(fileId);
            
            if (token !== expectedToken) {
                return res.status(401).json({ error: 'Token inválido' });
            }

            const file = await this.efService.getFileById(fileId);
            
            if (!file) {
                return res.status(404).json({ error: 'Arquivo não encontrado' });
            }

            const filePath = path.join('./uploads/ef', file.filename);
            
            if (!fs.existsSync(filePath)) {
                return res.status(404).json({ error: 'Arquivo não encontrado no sistema de arquivos' });
            }

            // Configurar headers para visualização inline
            res.setHeader('Content-Type', file.mimetype);
            res.setHeader('Content-Disposition', `inline; filename="${file.originalName}"`);
            
            // Enviar arquivo
            res.sendFile(path.resolve(filePath));
        } catch (error) {
            console.error('Erro ao visualizar arquivo público:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    @Get('file/:fileId/public-token')
    @UseGuards(JwtAuthGuard)
    async getPublicFileToken(@Param('fileId') fileId: string) {
        try {
            const token = await this.efService.generatePublicFileToken(fileId);
            return {
                fileId,
                token,
                downloadUrl: `http://localhost:3001/api/ef/public/file/${fileId}/${token}`,
                viewUrl: `http://localhost:3001/api/ef/public/file/${fileId}/${token}/view`
            };
        } catch (error) {
            console.error('Erro ao gerar token público:', error);
            throw new BadRequestException('Erro ao gerar token público para arquivo');
        }
    }

    // Método auxiliar para gerar token público simples
    private generateFileToken(fileId: string): string {
        // Token simples baseado no ID do arquivo (em produção usar algo mais seguro)
        const crypto = require('crypto');
        return crypto.createHash('md5').update(fileId + 'secret-key-pdf-access').digest('hex').substring(0, 16);
    }
}
