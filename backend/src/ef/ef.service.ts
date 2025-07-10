import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFunctionalSpecificationDto } from './dto/create-ef.dto';
import { UpdateFunctionalSpecificationDto } from './dto/update-ef.dto';
import { FunctionalSpecification } from './entities/ef.entity';

@Injectable()
export class EfService {
    constructor(private prisma: PrismaService) { }

    async create(createEfDto: CreateFunctionalSpecificationDto, authorId: string): Promise<FunctionalSpecification> {
        try {
            console.log('🚀 Iniciando criação de EF com dados:', JSON.stringify(createEfDto, null, 2));
            console.log('👤 Author ID:', authorId);

            // Buscar dados do usuário
            console.log('🔍 Buscando usuário com ID:', authorId);
            const user = await this.prisma.user.findUnique({
                where: { id: authorId },
                select: { username: true }
            });

            if (!user) {
                console.error('❌ Usuário não encontrado com ID:', authorId);
                throw new Error(`Usuário com ID ${authorId} não encontrado`);
            }

            console.log('✅ Usuário encontrado:', user.username);

            // Extrair requests e dados do cutover
            const { requests, cutoverPlan, includeCutoverPlan, ...efData } = createEfDto;

            // Preparar dados básicos da EF (sem requests por enquanto)
            const basicEfData = {
                ...efData,
                date: new Date(efData.date),
                startDateTime: new Date(efData.startDateTime),
                endDateTime: efData.endDateTime ? new Date(efData.endDateTime) : null,
                authorId,
                technicalAnalyst: user.username,
                author: user.username,
                includeCutoverPlan: includeCutoverPlan || false,
                cutoverObjective: (includeCutoverPlan && cutoverPlan?.objective) ? cutoverPlan.objective : null,
                cutoverTimeline: (includeCutoverPlan && cutoverPlan?.timeline) ? cutoverPlan.timeline : null,
                cutoverDetailedActivities: (includeCutoverPlan && cutoverPlan?.detailedActivities) ? cutoverPlan.detailedActivities : null,
                cutoverPreChecklistActivities: (includeCutoverPlan && cutoverPlan?.preChecklistActivities) ? cutoverPlan.preChecklistActivities : null,
                cutoverCommunicationPlan: (includeCutoverPlan && cutoverPlan?.communicationPlan) ? cutoverPlan.communicationPlan : null,
                cutoverTeamsAndResponsibilities: (includeCutoverPlan && cutoverPlan?.teamsAndResponsibilities) ? cutoverPlan.teamsAndResponsibilities : null,
                cutoverContingencyPlan: (includeCutoverPlan && cutoverPlan?.contingencyPlan) ? cutoverPlan.contingencyPlan : null,
                cutoverSuccessCriteria: (includeCutoverPlan && cutoverPlan?.successCriteria) ? cutoverPlan.successCriteria : null,
                cutoverPostGoLiveSupport: (includeCutoverPlan && cutoverPlan?.postGoLiveSupport) ? cutoverPlan.postGoLiveSupport : null,
            };

            console.log('�️ Dados básicos da EF preparados:', JSON.stringify(basicEfData, null, 2));

            // Primeiro, criar a EF sem requests
            console.log('� Criando EF no banco...');
            const ef = await this.prisma.functionalSpecification.create({
                data: basicEfData
            });

            console.log('✅ EF criada! ID:', ef.id);

            // Agora criar os requests separadamente
            if (requests && requests.length > 0) {
                console.log('📝 Criando requests...');
                const requestPromises = requests.map(request =>
                    this.prisma.functionalRequest.create({
                        data: {
                            description: request.description,
                            priority: request.priority || null,
                            functionalSpecificationId: ef.id
                        }
                    })
                );

                await Promise.all(requestPromises);
                console.log('✅ Requests criados!');
            }

            // Buscar a EF completa com relacionamentos
            const fullEf = await this.prisma.functionalSpecification.findUnique({
                where: { id: ef.id },
                include: {
                    requests: true,
                    files: true,
                    author_user: {
                        select: {
                            id: true,
                            username: true,
                            email: true,
                            role: true,
                        },
                    },
                }
            });

            console.log('✅ EF criada com sucesso! ID:', fullEf.id);
            return fullEf as FunctionalSpecification;
        } catch (error) {
            console.error('❌ Erro DETALHADO ao criar EF:');
            console.error('Tipo do erro:', error.constructor.name);
            console.error('Mensagem:', error.message);
            console.error('Stack:', error.stack);

            if (error.code) {
                console.error('Código do erro:', error.code);
            }

            if (error.meta) {
                console.error('Metadados do erro:', error.meta);
            }

            throw error;
        }
    }

    async findAll(): Promise<FunctionalSpecification[]> {
        const specs = await this.prisma.functionalSpecification.findMany({
            include: {
                requests: true,
                files: true,
                author_user: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        role: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return specs as FunctionalSpecification[];
    }

    async findOne(id: string): Promise<FunctionalSpecification> {
        const ef = await this.prisma.functionalSpecification.findUnique({
            where: { id },
            include: {
                requests: true,
                files: true,
                author_user: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        role: true,
                    },
                },
            },
        });

        if (!ef) {
            throw new NotFoundException(`Especificação Funcional com ID "${id}" não encontrada`);
        }

        return ef as FunctionalSpecification;
    }

    async update(id: string, updateEfDto: UpdateFunctionalSpecificationDto): Promise<FunctionalSpecification> {
        const { requests, cutoverPlan, includeCutoverPlan, ...efData } = updateEfDto;

        // Verificar se a EF existe
        await this.findOne(id);

        // Preparar dados do Cutover Plan se incluído
        const cutoverData = includeCutoverPlan !== undefined ? (
            includeCutoverPlan && cutoverPlan ? {
                includeCutoverPlan: true,
                cutoverObjective: cutoverPlan.objective,
                cutoverTimeline: cutoverPlan.timeline,
                cutoverDetailedActivities: cutoverPlan.detailedActivities,
                cutoverPreChecklistActivities: cutoverPlan.preChecklistActivities,
                cutoverCommunicationPlan: cutoverPlan.communicationPlan,
                cutoverTeamsAndResponsibilities: cutoverPlan.teamsAndResponsibilities,
                cutoverContingencyPlan: cutoverPlan.contingencyPlan,
                cutoverSuccessCriteria: cutoverPlan.successCriteria,
                cutoverPostGoLiveSupport: cutoverPlan.postGoLiveSupport,
            } : {
                includeCutoverPlan: false,
                cutoverObjective: null,
                cutoverTimeline: null,
                cutoverDetailedActivities: null,
                cutoverPreChecklistActivities: null,
                cutoverCommunicationPlan: null,
                cutoverTeamsAndResponsibilities: null,
                cutoverContingencyPlan: null,
                cutoverSuccessCriteria: null,
                cutoverPostGoLiveSupport: null,
            }
        ) : {};

        // Atualizar EF
        const updatedEf = await this.prisma.functionalSpecification.update({
            where: { id },
            data: {
                ...efData,
                ...cutoverData,
                date: efData.date ? new Date(efData.date) : undefined,
                startDateTime: efData.startDateTime ? new Date(efData.startDateTime) : undefined,
                endDateTime: efData.endDateTime ? new Date(efData.endDateTime) : undefined,
            },
            include: {
                requests: true,
                files: true,
                author_user: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        role: true,
                    },
                },
            },
        });

        // Atualizar requests se fornecidas
        if (requests) {
            // Remover requests existentes
            await this.prisma.functionalRequest.deleteMany({
                where: { functionalSpecificationId: id },
            });

            // Criar novas requests
            await this.prisma.functionalRequest.createMany({
                data: requests.map(request => ({
                    description: request.description,
                    priority: request.priority,
                    functionalSpecificationId: id,
                })),
            });
        }

        // Buscar EF atualizada com requests
        return this.findOne(id);
    }

    async remove(id: string): Promise<void> {
        await this.findOne(id); // Verificar se existe

        await this.prisma.functionalSpecification.delete({
            where: { id },
        });
    }

    async uploadFiles(id: string, files: Express.Multer.File[], type: 'process-diagram' | 'unit-tests' | 'attachments', uploadedById: string) {
        await this.findOne(id); // Verificar se a EF existe

        const fileRecords = [];

        for (const file of files) {
            const fileRecord = await this.prisma.fileUpload.create({
                data: {
                    filename: file.filename,
                    originalName: file.originalname,
                    mimetype: file.mimetype,
                    size: file.size,
                    path: `uploads/ef/${file.filename}`,
                    functionalSpecificationId: id,
                    uploadedById: uploadedById
                }
            });

            fileRecords.push(fileRecord);
        }

        return {
            message: 'Arquivos enviados com sucesso',
            files: fileRecords
        };
    }

    async getFileById(fileId: string) {
        return await this.prisma.fileUpload.findUnique({
            where: { id: fileId }
        });
    }

    /**
     * Verifica se o usuário tem permissão para editar/deletar a EF
     * Apenas o autor (criador) da EF pode editá-la ou deletá-la
     */
    async verifyEditPermission(efId: string, userId: string): Promise<void> {
        console.log('🔐 Verificando permissão de edição para EF:', efId, 'Usuário:', userId);

        // Buscar a EF para verificar o autor
        const ef = await this.prisma.functionalSpecification.findUnique({
            where: { id: efId },
            select: {
                id: true,
                cardNumber: true,
                authorId: true,
                author: true
            }
        });

        if (!ef) {
            console.error('❌ EF não encontrada:', efId);
            throw new NotFoundException(`Especificação Funcional com ID "${efId}" não encontrada`);
        }

        // Verificar se o usuário é o autor
        if (ef.authorId !== userId) {
            console.error('❌ Usuário sem permissão:', {
                efId: ef.id,
                cardNumber: ef.cardNumber,
                authorId: ef.authorId,
                requestingUserId: userId,
                author: ef.author
            });

            throw new ForbiddenException(
                'Você não tem permissão para editar esta Especificação Funcional. ' +
                'Apenas o autor que criou a EF pode editá-la ou excluí-la.'
            );
        }

        console.log('✅ Permissão verificada com sucesso para EF:', ef.cardNumber);
    }

    async generatePublicFileToken(fileId: string): Promise<string> {
        // Verificar se o arquivo existe
        const file = await this.getFileById(fileId);
        if (!file) {
            throw new Error('Arquivo não encontrado');
        }

        // Gerar token público simples
        const crypto = require('crypto');
        return crypto.createHash('md5').update(fileId + 'secret-key-pdf-access').digest('hex').substring(0, 16);
    }
}
