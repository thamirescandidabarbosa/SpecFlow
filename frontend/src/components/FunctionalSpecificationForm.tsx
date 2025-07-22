import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../contexts/AuthContext';
import { getFileIcon, formatFileSize } from '../utils/fileUtils';
import { toast } from 'react-toastify';
import {
    Rocket, Edit, Save, X, Folder, Settings, Tag, Building, User, Calendar, Hash, Database, MessageSquare, FileText, BarChart3, Trash2, Plus, Target, CheckCircle, Clock, Play, Users, Shield, Headphones, Upload
} from 'lucide-react';
import { FunctionalSpecification } from '../types';
import { functionalSpecificationService } from '../services/functionalSpecificationService';

// Interface para o formulário
interface FormData {
    cardNumber: string;
    projectName: string;
    gmud?: string;
    date: string;
    version: string;
    developmentEnvironment: 'EQ0' | 'EP0' | 'ED0';
    comment?: string;
    developmentDescription: string;
    functionalSpecification: string;
    changeDescription: string;
    order?: string;
    requests: { description: string; priority?: string }[];
    status: 'Em andamento' | 'Pronto' | 'Cancelado' | 'Em análise' | 'Aprovado';
    startDateTime: string;
    endDateTime?: string;
    includeCutoverPlan: boolean;
    cutoverObjective?: string;
    cutoverTimeline?: string;
    cutoverDetailedActivities?: string;
    cutoverPreChecklistActivities?: string;
    cutoverCommunicationPlan?: string;
    cutoverTeamsAndResponsibilities?: string;
    cutoverContingencyPlan?: string;
    cutoverSuccessCriteria?: string;
    cutoverPostGoLiveSupport?: string;
}

// Props do componente
interface FunctionalSpecificationFormProps {
    mode: 'create' | 'edit';
    efId?: string;
    onSuccess?: () => void;
    onCancel?: () => void;
}

// Schema de validação com Yup (expandido para incluir cutover plan)
const schema = yup.object({
    cardNumber: yup.string().required('N° do Card é obrigatório'),
    projectName: yup.string().required('Nome do Projeto é obrigatório'),
    date: yup.string().required('Data é obrigatória'),
    version: yup.string().required('Versão é obrigatória'),
    developmentEnvironment: yup.string().oneOf(['EQ0', 'EP0', 'ED0']).required('Ambiente de Desenvolvimento é obrigatório'),
    developmentDescription: yup.string().required('Descrição do Desenvolvimento é obrigatória'),
    functionalSpecification: yup.string().required('Especificação Funcional é obrigatória'),
    changeDescription: yup.string().required('Descrição da Mudança é obrigatória'),
    requests: yup.array().of(
        yup.object({
            description: yup.string().required('Descrição da request é obrigatória'),
            priority: yup.string().optional()
        })
    ).required().min(1, 'Pelo menos uma request é obrigatória'),
    status: yup.string().oneOf(['Em andamento', 'Pronto', 'Cancelado', 'Em análise', 'Aprovado']).required('Status é obrigatório'),
    startDateTime: yup.string().required('Data/Horário de início é obrigatório'),
    endDateTime: yup.string().optional(),
    gmud: yup.string().optional(),
    comment: yup.string().optional(),
    order: yup.string().optional(),
    // Cutover plan fields (condicionais)
    includeCutoverPlan: yup.boolean().required(),
    cutoverObjective: yup.string().when('includeCutoverPlan', {
        is: true,
        then: (schema) => schema.required('Objetivo do Cutover é obrigatório quando o plano está habilitado'),
        otherwise: (schema) => schema.optional()
    }),
    cutoverTimeline: yup.string().when('includeCutoverPlan', {
        is: true,
        then: (schema) => schema.required('Timeline do Cutover é obrigatória quando o plano está habilitado'),
        otherwise: (schema) => schema.optional()
    }),
    cutoverDetailedActivities: yup.string().when('includeCutoverPlan', {
        is: true,
        then: (schema) => schema.required('Atividades Detalhadas são obrigatórias quando o plano está habilitado'),
        otherwise: (schema) => schema.optional()
    }),
    cutoverPreChecklistActivities: yup.string().when('includeCutoverPlan', {
        is: true,
        then: (schema) => schema.required('Checklist de Pré-Cutover é obrigatório quando o plano está habilitado'),
        otherwise: (schema) => schema.optional()
    }),
    cutoverCommunicationPlan: yup.string().when('includeCutoverPlan', {
        is: true,
        then: (schema) => schema.required('Plano de Comunicação é obrigatório quando o plano está habilitado'),
        otherwise: (schema) => schema.optional()
    }),
    cutoverTeamsAndResponsibilities: yup.string().when('includeCutoverPlan', {
        is: true,
        then: (schema) => schema.required('Equipes Envolvidas e Responsabilidades é obrigatório quando o plano está habilitado'),
        otherwise: (schema) => schema.optional()
    }),
    cutoverContingencyPlan: yup.string().when('includeCutoverPlan', {
        is: true,
        then: (schema) => schema.required('Plano de Contingência é obrigatório quando o plano está habilitado'),
        otherwise: (schema) => schema.optional()
    }),
    cutoverSuccessCriteria: yup.string().when('includeCutoverPlan', {
        is: true,
        then: (schema) => schema.required('Critérios de Sucesso / Go-Live é obrigatório quando o plano está habilitado'),
        otherwise: (schema) => schema.optional()
    }),
    cutoverPostGoLiveSupport: yup.string().when('includeCutoverPlan', {
        is: true,
        then: (schema) => schema.required('Suporte Pós-Go-Live é obrigatório quando o plano está habilitado'),
        otherwise: (schema) => schema.optional()
    })
});

const FunctionalSpecificationForm: React.FC<FunctionalSpecificationFormProps> = ({
    mode,
    efId,
    onSuccess,
    onCancel
}) => {
    const { user } = useAuth();
    const [processDiagram, setProcessDiagram] = useState<File | null>(null);
    const [unitTestFiles, setUnitTestFiles] = useState<File[]>([]);
    const [attachmentFiles, setAttachmentFiles] = useState<File[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(false);
    const [canEdit, setCanEdit] = useState(true);
    const [specification, setSpecification] = useState<FunctionalSpecification | null>(null);

    const {
        control,
        handleSubmit,
        watch,
        formState: { errors },
        reset
    } = useForm<FormData>({
        resolver: yupResolver(schema),
        defaultValues: {
            date: new Date().toISOString().split('T')[0],
            version: '1.0',
            developmentEnvironment: 'EQ0',
            status: 'Em andamento',
            startDateTime: new Date().toISOString().slice(0, 16),
            requests: [{ description: '', priority: '' }],
            includeCutoverPlan: false,
            cutoverObjective: '',
            cutoverTimeline: '',
            cutoverDetailedActivities: '',
            cutoverPreChecklistActivities: '',
            cutoverCommunicationPlan: '',
            cutoverTeamsAndResponsibilities: '',
            cutoverContingencyPlan: '',
            cutoverSuccessCriteria: '',
            cutoverPostGoLiveSupport: ''
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'requests'
    });

    const includeCutoverPlan = watch('includeCutoverPlan');

    // Função para carregar dados em modo de edição
    const loadSpecificationData = React.useCallback(async () => {
        try {
            setLoading(true);

            // Carregar a especificação
            const spec = await functionalSpecificationService.getById(efId!);
            console.log('📋 Especificação carregada:', spec);
            console.log('📎 Arquivos na especificação:', spec.files);
            setSpecification(spec);

            // Verificar permissão de edição
            const permission = await functionalSpecificationService.canEdit(efId!);
            setCanEdit(permission.canEdit);

            if (!permission.canEdit) {
                return;
            }

            // Preencher o formulário com os dados carregados
            const formValues: FormData = {
                cardNumber: spec.cardNumber || '',
                projectName: spec.projectName || '',
                gmud: spec.gmud || '',
                date: spec.date ? new Date(spec.date).toISOString().split('T')[0] : '',
                version: spec.version || '1.0',
                developmentEnvironment: spec.developmentEnvironment || 'EQ0',
                comment: spec.comment || '',
                developmentDescription: spec.developmentDescription || '',
                functionalSpecification: spec.functionalSpecification || '',
                changeDescription: spec.changeDescription || '',
                order: spec.order || '',
                status: spec.status || 'Em andamento',
                startDateTime: spec.startDateTime ? new Date(spec.startDateTime).toISOString().slice(0, 16) : '',
                endDateTime: spec.endDateTime ? new Date(spec.endDateTime).toISOString().slice(0, 16) : '',
                requests: spec.requests ? spec.requests.map(req => ({
                    description: req.description,
                    priority: req.priority || 'Média'
                })) : [{ description: '', priority: '' }],
                includeCutoverPlan: spec.includeCutoverPlan || false,
                cutoverObjective: (spec as any).cutoverObjective || '',
                cutoverTimeline: (spec as any).cutoverTimeline || '',
                cutoverDetailedActivities: (spec as any).cutoverDetailedActivities || '',
                cutoverPreChecklistActivities: (spec as any).cutoverPreChecklistActivities || '',
                cutoverCommunicationPlan: (spec as any).cutoverCommunicationPlan || '',
                cutoverTeamsAndResponsibilities: (spec as any).cutoverTeamsAndResponsibilities || '',
                cutoverContingencyPlan: (spec as any).cutoverContingencyPlan || '',
                cutoverSuccessCriteria: (spec as any).cutoverSuccessCriteria || '',
                cutoverPostGoLiveSupport: (spec as any).cutoverPostGoLiveSupport || ''
            };

            reset(formValues);

        } catch (err: any) {
            console.error('Erro ao carregar especificação:', err);
            toast.error('Erro ao carregar especificação funcional');
        } finally {
            setLoading(false);
        }
    }, [efId, reset]);

    // Carregar dados em modo de edição
    useEffect(() => {
        if (mode === 'edit' && efId) {
            loadSpecificationData();
        }
    }, [mode, efId, loadSpecificationData]);

    const onSubmit = async (data: FormData) => {
        if (mode === 'edit' && !canEdit) {
            toast.error('Você não tem permissão para editar esta especificação.');
            return;
        }

        setIsSubmitting(true);

        try {
            if (mode === 'create') {
                await handleCreateSubmit(data);
            } else {
                await handleEditSubmit(data);
            }

            if (onSuccess) {
                onSuccess();
            }
        } catch (error) {
            console.error('Erro ao salvar:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCreateSubmit = async (data: FormData) => {
        try {
            // Transformar dados para o formato esperado pelo backend
            const backendData: any = {
                cardNumber: data.cardNumber,
                projectName: data.projectName,
                gmud: data.gmud,
                date: data.date,
                version: data.version,
                developmentEnvironment: data.developmentEnvironment,
                comment: data.comment,
                developmentDescription: data.developmentDescription,
                functionalSpecification: data.functionalSpecification,
                changeDescription: data.changeDescription,
                order: data.order,
                requests: data.requests,
                status: data.status,
                startDateTime: data.startDateTime,
                endDateTime: data.endDateTime,
                includeCutoverPlan: data.includeCutoverPlan,
            };

            // Se incluir cutover plan, criar o objeto aninhado
            if (data.includeCutoverPlan) {
                backendData.cutoverPlan = {
                    objective: data.cutoverObjective,
                    timeline: data.cutoverTimeline,
                    detailedActivities: data.cutoverDetailedActivities,
                    preChecklistActivities: data.cutoverPreChecklistActivities,
                    communicationPlan: data.cutoverCommunicationPlan,
                    teamsAndResponsibilities: data.cutoverTeamsAndResponsibilities,
                    contingencyPlan: data.cutoverContingencyPlan,
                    successCriteria: data.cutoverSuccessCriteria,
                    postGoLiveSupport: data.cutoverPostGoLiveSupport,
                };
            }

            console.log('Dados transformados para criação:', backendData);

            // Criar a especificação
            const createdEf = await functionalSpecificationService.create(backendData);

            // Upload de arquivos se houver
            if (processDiagram) {
                await functionalSpecificationService.uploadProcessDiagram(createdEf.id, processDiagram);
            }

            if (unitTestFiles.length > 0) {
                await functionalSpecificationService.uploadUnitTests(createdEf.id, unitTestFiles);
            }

            if (attachmentFiles.length > 0) {
                await functionalSpecificationService.uploadAttachments(createdEf.id, attachmentFiles);
            }

            toast.success('Especificação Funcional criada com sucesso!');

            // Reset form apenas no modo de criação
            if (mode === 'create') {
                reset();
                setProcessDiagram(null);
                setUnitTestFiles([]);
                setAttachmentFiles([]);
            }

        } catch (error: any) {
            console.error('Erro ao criar especificação:', error);
            if (error.response?.status === 400) {
                toast.error('Dados inválidos. Verifique os campos e tente novamente.');
            } else {
                toast.error('Erro ao criar especificação. Tente novamente.');
            }
            throw error;
        }
    };

    const handleEditSubmit = async (data: FormData) => {
        try {
            console.log('Dados do formulário para edição:', data);

            // Validar se todos os campos obrigatórios estão preenchidos
            const requiredFields = {
                cardNumber: data.cardNumber,
                projectName: data.projectName,
                date: data.date,
                version: data.version,
                developmentEnvironment: data.developmentEnvironment,
                developmentDescription: data.developmentDescription,
                functionalSpecification: data.functionalSpecification,
                changeDescription: data.changeDescription,
                status: data.status,
                startDateTime: data.startDateTime,
                requests: data.requests
            };

            console.log('Validando campos obrigatórios:', requiredFields);

            // Verificar se há campos vazios
            const emptyFields = Object.entries(requiredFields).filter(([key, value]) => {
                if (key === 'requests') {
                    const requests = value as { description: string; priority?: string }[];
                    return !requests || requests.length === 0 || requests.some((req: any) => !req.description);
                }
                return !value || value === '';
            });

            if (emptyFields.length > 0) {
                console.error('Campos obrigatórios vazios:', emptyFields);
                toast.error(`Campos obrigatórios não preenchidos: ${emptyFields.map(([key]) => key).join(', ')}`);
                return;
            }

            // Transformar dados para o formato esperado pelo backend
            const backendData: any = {
                cardNumber: data.cardNumber,
                projectName: data.projectName,
                gmud: data.gmud || undefined,
                date: data.date,
                version: data.version,
                developmentEnvironment: data.developmentEnvironment,
                comment: data.comment || undefined,
                developmentDescription: data.developmentDescription,
                functionalSpecification: data.functionalSpecification,
                changeDescription: data.changeDescription,
                order: data.order || undefined,
                requests: data.requests.map(req => ({
                    description: req.description,
                    priority: req.priority || undefined
                })),
                status: data.status,
                startDateTime: data.startDateTime,
                endDateTime: data.endDateTime || undefined,
                includeCutoverPlan: data.includeCutoverPlan,
            };

            // Se incluir cutover plan, criar o objeto aninhado
            if (data.includeCutoverPlan) {
                // Validar campos obrigatórios do cutover plan
                const cutoverRequiredFields = {
                    cutoverObjective: data.cutoverObjective,
                    cutoverTimeline: data.cutoverTimeline,
                    cutoverDetailedActivities: data.cutoverDetailedActivities,
                    cutoverPreChecklistActivities: data.cutoverPreChecklistActivities,
                    cutoverCommunicationPlan: data.cutoverCommunicationPlan,
                    cutoverTeamsAndResponsibilities: data.cutoverTeamsAndResponsibilities,
                    cutoverContingencyPlan: data.cutoverContingencyPlan,
                    cutoverSuccessCriteria: data.cutoverSuccessCriteria,
                    cutoverPostGoLiveSupport: data.cutoverPostGoLiveSupport,
                };

                const emptyCutoverFields = Object.entries(cutoverRequiredFields).filter(([key, value]) => !value || value === '');

                if (emptyCutoverFields.length > 0) {
                    console.error('Campos obrigatórios do cutover vazios:', emptyCutoverFields);
                    toast.error(`Campos do Plano de Cutover obrigatórios não preenchidos: ${emptyCutoverFields.map(([key]) => key.replace('cutover', '')).join(', ')}`);
                    return;
                }

                backendData.cutoverPlan = {
                    objective: data.cutoverObjective,
                    timeline: data.cutoverTimeline,
                    detailedActivities: data.cutoverDetailedActivities,
                    preChecklistActivities: data.cutoverPreChecklistActivities,
                    communicationPlan: data.cutoverCommunicationPlan,
                    teamsAndResponsibilities: data.cutoverTeamsAndResponsibilities,
                    contingencyPlan: data.cutoverContingencyPlan,
                    successCriteria: data.cutoverSuccessCriteria,
                    postGoLiveSupport: data.cutoverPostGoLiveSupport,
                };
            }

            console.log('Dados transformados para backend:', JSON.stringify(backendData, null, 2));

            // Atualizar a especificação
            await functionalSpecificationService.update(efId!, backendData);

            // Upload de arquivos se houver novos
            if (processDiagram) {
                await functionalSpecificationService.uploadProcessDiagram(efId!, processDiagram);
            }

            if (unitTestFiles.length > 0) {
                await functionalSpecificationService.uploadUnitTests(efId!, unitTestFiles);
            }

            if (attachmentFiles.length > 0) {
                await functionalSpecificationService.uploadAttachments(efId!, attachmentFiles);
            }

            toast.success('Especificação Funcional atualizada com sucesso!');

        } catch (error: any) {
            console.error('Erro ao atualizar especificação:', error);
            console.error('Resposta completa do erro:', error.response);

            let errorMessage = 'Erro ao atualizar especificação. ';
            if (error.response) {
                errorMessage += `Status: ${error.response.status}. `;
                if (error.response.data?.message) {
                    errorMessage += `Mensagem: ${error.response.data.message}. `;
                }
                if (error.response.data?.errors) {
                    errorMessage += `Erros: ${error.response.data.errors.join(', ')}. `;
                }
            }
            toast.error(errorMessage);
            throw error;
        }
    };

    const handleProcessDiagramUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const validTypes = [
                'image/jpeg', 'image/jpg', 'image/png', 'image/gif',
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            ];
            const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.pdf', '.doc', '.docx'];

            const isValidType = validTypes.includes(file.type) ||
                validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));

            if (!isValidType) {
                toast.error('Apenas arquivos de imagem (JPEG, PNG, GIF), PDF ou Word (DOC, DOCX) são permitidos.');
                return;
            }
            if (file.size > 10 * 1024 * 1024) // 10MB
            {
                toast.error('O arquivo deve ter no máximo 10MB.');
                return;
            }
            setProcessDiagram(file);
        }
    };

    const handleUnitTestsUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        if (files.length > 0) {
            const validTypes = [
                // Tipos de código de teste
                'text/plain', 'application/javascript', 'text/javascript',
                'application/x-python-code', 'text/x-python', 'application/java-archive',
                'text/x-java-source', 'text/x-csharp',
                // Tipos de documento e imagem
                'image/jpeg', 'image/jpg', 'image/png', 'image/gif',
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            ];

            const validExtensions = [
                '.js', '.py', '.java', '.cs', '.txt', '.ts',
                '.jpg', '.jpeg', '.png', '.gif', '.pdf', '.doc', '.docx'
            ];

            const invalidFiles = files.filter(file => {
                const isValidType = validTypes.includes(file.type);
                const isValidExtension = validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
                return !isValidType && !isValidExtension;
            });

            if (invalidFiles.length > 0) {
                toast.error('Apenas arquivos de código de teste, PDF, Word (DOC/DOCX) ou imagens (JPEG, PNG, GIF) são permitidos.');
                return;
            }

            const oversizedFiles = files.filter(file => file.size > 10 * 1024 * 1024); // 10MB por arquivo
            if (oversizedFiles.length > 0) {
                toast.error('Cada arquivo deve ter no máximo 10MB.');
                return;
            }

            setUnitTestFiles(prev => [...prev, ...files]);
        }
    };

    const removeUnitTestFile = (index: number) => {
        setUnitTestFiles(prev => prev.filter((_, i) => i !== index));
    };

    // Função para lidar com upload de anexos gerais
    const handleAttachmentsUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        if (files.length > 0) {
            const validTypes = [
                'image/jpeg', 'image/jpg', 'image/png', 'image/gif',
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'text/plain',
                'application/vnd.ms-excel',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            ];

            const validExtensions = [
                '.jpg', '.jpeg', '.png', '.gif', '.pdf', '.doc', '.docx', '.txt', '.xls', '.xlsx'
            ];

            const invalidFiles = files.filter(file => {
                const isValidType = validTypes.includes(file.type);
                const isValidExtension = validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
                return !isValidType && !isValidExtension;
            });

            if (invalidFiles.length > 0) {
                toast.error('Apenas arquivos PDF, Word (DOC/DOCX), Excel (XLS/XLSX), imagens (JPEG, PNG, GIF) ou texto (TXT) são permitidos.');
                return;
            }

            const oversizedFiles = files.filter(file => file.size > 10 * 1024 * 1024); // 10MB por arquivo
            if (oversizedFiles.length > 0) {
                toast.error('Cada arquivo deve ter no máximo 10MB.');
                return;
            }

            setAttachmentFiles(prev => [...prev, ...files]);
        }
    };

    const removeAttachmentFile = (index: number) => {
        setAttachmentFiles(prev => prev.filter((_, i) => i !== index));
    };

    // Função para visualizar arquivo com tratamento de erro
    const handleViewFile = async (fileId: string, fileName: string) => {
        try {
            // Mostrar toast informativo
            toast.info(`Abrindo "${fileName}" em nova janela...`, {
                autoClose: 2000,
                position: "bottom-right"
            });

            console.log('👁️ Tentando visualizar arquivo:', fileName);
            await functionalSpecificationService.viewFile(fileId);
        } catch (error) {
            console.error('❌ Erro ao visualizar arquivo:', error);
            const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
            toast.error(`Erro ao visualizar "${fileName}": ${errorMessage}`);
        }
    };

    // Função para baixar arquivo com tratamento de erro
    const handleDownloadFile = async (fileId: string, fileName: string) => {
        try {
            // Mostrar toast informativo de início do download
            const downloadToast = toast.loading(`Preparando download de "${fileName}"...`, {
                position: "bottom-right"
            });

            console.log('💾 Tentando baixar arquivo:', fileName);
            await functionalSpecificationService.downloadFile(fileId, fileName);

            // Atualizar toast para sucesso
            toast.update(downloadToast, {
                render: `"${fileName}" baixado com sucesso!`,
                type: "success",
                isLoading: false,
                autoClose: 3000,
                closeButton: true
            });
        } catch (error) {
            console.error('❌ Erro ao baixar arquivo:', error);
            const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
            toast.error(`Erro ao baixar "${fileName}": ${errorMessage}`);
        }
    };

    // Função para excluir arquivo com tratamento de erro e confirmação
    const handleDeleteFile = async (fileId: string, fileName: string) => {
        // Confirmar antes de excluir
        if (!window.confirm(`Tem certeza que deseja excluir o arquivo "${fileName}"? Esta ação não pode ser desfeita.`)) {
            return;
        }

        try {
            // Mostrar toast informativo de início da exclusão
            const deleteToast = toast.loading(`Excluindo "${fileName}"...`, {
                position: "bottom-right"
            });

            console.log('🗑️ Tentando excluir arquivo:', fileName);
            await functionalSpecificationService.deleteFile(fileId);

            // Atualizar toast para sucesso
            toast.update(deleteToast, {
                render: `"${fileName}" excluído com sucesso!`,
                type: "success",
                isLoading: false,
                autoClose: 3000,
                closeButton: true
            });

            // Atualizar a lista de arquivos recarregando os dados da especificação
            if (mode === 'edit' && efId) {
                await loadSpecificationData();
            }
        } catch (error) {
            console.error('❌ Erro ao excluir arquivo:', error);
            const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
            toast.error(`Erro ao excluir "${fileName}": ${errorMessage}`);
        }
    };
    // (Removido: handleGeneratePublicLink não era utilizado)

    // Estado de loading inicial para modo de edição
    if (mode === 'edit' && loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '50vh',
                flexDirection: 'column',
                gap: '20px'
            }}>
                <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
                <p>Carregando especificação...</p>
            </div>
        );
    }

    // Verificação de permissão para edição
    if (mode === 'edit' && !canEdit) {
        return (
            <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
                <div className="card">
                    <div className="card-header" style={{ backgroundColor: '#f8d7da', color: '#721c24' }}>
                        <h2 style={{ margin: 0 }}>🚫 Acesso Negado</h2>
                    </div>
                    <div className="card-body">
                        <div style={{ textAlign: 'center', padding: '40px' }}>
                            <h3 style={{ color: '#dc3545', marginBottom: '20px' }}>
                                Você não tem permissão para editar esta Especificação Funcional
                            </h3>
                            <p style={{ fontSize: '16px', color: '#666', marginBottom: '20px' }}>
                                Apenas o autor que criou a EF pode editá-la.
                            </p>
                            <button
                                className="btn btn-secondary"
                                onClick={onCancel}
                            >
                                Voltar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
            <form onSubmit={handleSubmit(onSubmit)}>
                {/* Seção 1: Informações Básicas */}
                <div style={{ marginBottom: '30px' }}>
                    <h3 style={{
                        borderBottom: '2px solid #007bff',
                        paddingBottom: '5px',
                        marginBottom: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        <Settings size={20} />
                        Informações Básicas
                    </h3>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                        <div className="form-group">
                            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Tag size={16} aria-label="Número do card" />
                                N° do Card *
                            </label>
                            <Controller
                                name="cardNumber"
                                control={control}
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        type="text"
                                        className="form-input"
                                        placeholder="Ex: CARD-2025-001"
                                    />
                                )}
                            />
                            {errors.cardNumber && <div className="error">{errors.cardNumber.message}</div>}
                        </div>

                        <div className="form-group">
                            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Building size={16} aria-label="Nome do projeto" />
                                Nome do Projeto *
                            </label>
                            <Controller
                                name="projectName"
                                control={control}
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        type="text"
                                        className="form-input"
                                        placeholder="Nome do projeto"
                                    />
                                )}
                            />
                            {errors.projectName && <div className="error">{errors.projectName.message}</div>}
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                        <div className="form-group">
                            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <User size={16} aria-label="Analista técnico" />
                                Analista Técnico
                            </label>
                            <input
                                type="text"
                                className="form-input"
                                value={user?.username || ''}
                                disabled
                                style={{ backgroundColor: '#f8f9fa' }}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{ width: 16, display: 'inline-block' }} aria-label="GMUD"></span>
                                GMUD
                            </label>
                            <Controller
                                name="gmud"
                                control={control}
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        type="text"
                                        className="form-input"
                                        placeholder="GMUD"
                                    />
                                )}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Calendar size={16} aria-label="Data" />
                                Data *
                            </label>
                            <Controller
                                name="date"
                                control={control}
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        type="date"
                                        className="form-input"
                                    />
                                )}
                            />
                            {errors.date && <div className="error">{errors.date.message}</div>}
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                        <div className="form-group">
                            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Hash size={16} aria-label="Versão" />
                                Versão *
                            </label>
                            <Controller
                                name="version"
                                control={control}
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        type="text"
                                        className="form-input"
                                        placeholder="1.0"
                                    />
                                )}
                            />
                            {errors.version && <div className="error">{errors.version.message}</div>}
                        </div>

                        <div className="form-group">
                            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Database size={16} aria-label="Ambiente de desenvolvimento" />
                                Ambiente de Desenvolvimento *
                            </label>
                            <Controller
                                name="developmentEnvironment"
                                control={control}
                                render={({ field }) => (
                                    <select {...field} className="form-input">
                                        <option value="EQ0">EQ0</option>
                                        <option value="EP0">EP0</option>
                                        <option value="ED0">ED0</option>
                                    </select>
                                )}
                            />
                            {errors.developmentEnvironment && <div className="error">{errors.developmentEnvironment.message}</div>}
                        </div>

                        <div className="form-group">
                            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <User size={16} aria-label="Autor" />
                                Autor *
                            </label>
                            <input
                                type="text"
                                className="form-input"
                                value={user?.username || ''}
                                disabled
                                style={{ backgroundColor: '#f8f9fa' }}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <MessageSquare size={16} aria-label="Comentário" />
                            Comentário
                        </label>
                        <Controller
                            name="comment"
                            control={control}
                            render={({ field }) => (
                                <textarea
                                    {...field}
                                    className="form-input"
                                    rows={3}
                                    placeholder="Comentários adicionais..."
                                />
                            )}
                        />
                    </div>
                </div>

                {/* Seção 2: Especificações */}
                <div style={{ marginBottom: '30px' }}>
                    <h3 style={{
                        borderBottom: '2px solid #28a745',
                        paddingBottom: '5px',
                        marginBottom: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        <FileText size={20} />
                        Especificações
                    </h3>

                    <div className="form-group">
                        <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Edit size={16} aria-label="Descrição do desenvolvimento" />
                            Descrição do Desenvolvimento *
                        </label>
                        <Controller
                            name="developmentDescription"
                            control={control}
                            render={({ field }) => (
                                <textarea
                                    {...field}
                                    className="form-input"
                                    rows={4}
                                    placeholder="Descreva o desenvolvimento que será realizado..."
                                />
                            )}
                        />
                        {errors.developmentDescription && <div className="error">{errors.developmentDescription.message}</div>}
                    </div>

                    <div className="form-group">
                        <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <FileText size={16} aria-label="Especificação funcional" />
                            Especificação Funcional *
                        </label>
                        <Controller
                            name="functionalSpecification"
                            control={control}
                            render={({ field }) => (
                                <textarea
                                    {...field}
                                    className="form-input"
                                    rows={6}
                                    placeholder="Detalhe a especificação funcional..."
                                />
                            )}
                        />
                        {errors.functionalSpecification && <div className="error">{errors.functionalSpecification.message}</div>}
                    </div>

                    <div className="form-group">
                        <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Edit size={16} aria-label="Descrição da mudança" />
                            Descrição da Mudança *
                        </label>
                        <Controller
                            name="changeDescription"
                            control={control}
                            render={({ field }) => (
                                <textarea
                                    {...field}
                                    className="form-input"
                                    rows={4}
                                    placeholder="Descreva as mudanças que serão implementadas..."
                                />
                            )}
                        />
                        {errors.changeDescription && <div className="error">{errors.changeDescription.message}</div>}
                    </div>
                </div>

                {/* Seção 3: Controle de Execução */}
                <div style={{ marginBottom: '30px' }}>
                    <h3 style={{
                        borderBottom: '2px solid #ffc107',
                        paddingBottom: '5px',
                        marginBottom: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        <Calendar size={20} />
                        Controle de Execução
                    </h3>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                        <div className="form-group">
                            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Tag size={16} aria-label="Ordem" />
                                Ordem
                            </label>
                            <Controller
                                name="order"
                                control={control}
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        type="text"
                                        className="form-input"
                                        placeholder="Ordem de execução"
                                    />
                                )}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <CheckCircle size={16} aria-label="Status" />
                                Status *
                            </label>
                            <Controller
                                name="status"
                                control={control}
                                render={({ field }) => (
                                    <select {...field} className="form-input">
                                        <option value="Em andamento">Em andamento</option>
                                        <option value="Pronto">Pronto</option>
                                        <option value="Cancelado">Cancelado</option>
                                        <option value="Em análise">Em análise</option>
                                        <option value="Aprovado">Aprovado</option>
                                    </select>
                                )}
                            />
                            {errors.status && <div className="error">{errors.status.message}</div>}
                        </div>

                        <div className="form-group">
                            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Clock size={16} aria-label="Data/Hora de início" />
                                Data/Hora de Início *
                            </label>
                            <Controller
                                name="startDateTime"
                                control={control}
                                render={({ field }) => (
                                    <input
                                        {...field}
                                        type="datetime-local"
                                        className="form-input"
                                    />
                                )}
                            />
                            {errors.startDateTime && <div className="error">{errors.startDateTime.message}</div>}
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Clock size={16} aria-label="Data/Hora de término" />
                            Data/Hora de Término
                        </label>
                        <Controller
                            name="endDateTime"
                            control={control}
                            render={({ field }) => (
                                <input
                                    {...field}
                                    type="datetime-local"
                                    className="form-input"
                                />
                            )}
                        />
                    </div>
                </div>

                {/* Seção 4: Solicitações */}
                <div style={{ marginBottom: '30px' }}>
                    <h3 style={{
                        borderBottom: '2px solid #17a2b8',
                        paddingBottom: '5px',
                        marginBottom: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        <User size={20} />
                        Solicitações
                    </h3>

                    {fields.map((field, index) => (
                        <div key={field.id} style={{
                            display: 'grid',
                            gridTemplateColumns: '2fr 1fr auto',
                            gap: '15px',
                            marginBottom: '15px',
                            alignItems: 'end'
                        }}>
                            <div className="form-group">
                                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <FileText size={16} aria-label="Descrição da solicitação" />
                                    Descrição da Solicitação {index + 1} *
                                </label>
                                <Controller
                                    name={`requests.${index}.description`}
                                    control={control}
                                    render={({ field }) => (
                                        <textarea
                                            {...field}
                                            className="form-input"
                                            rows={2}
                                            placeholder="Descreva a solicitação..."
                                        />
                                    )}
                                />
                                {errors.requests?.[index]?.description && (
                                    <div className="error">{errors.requests[index]?.description?.message}</div>
                                )}
                            </div>

                            <div className="form-group">
                                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <BarChart3 size={16} aria-label="Prioridade" />
                                    Prioridade
                                </label>
                                <Controller
                                    name={`requests.${index}.priority`}
                                    control={control}
                                    render={({ field }) => (
                                        <select {...field} className="form-input">
                                            <option value="">Selecione...</option>
                                            <option value="Baixa">Baixa</option>
                                            <option value="Média">Média</option>
                                            <option value="Alta">Alta</option>
                                            <option value="Crítica">Crítica</option>
                                        </select>
                                    )}
                                />
                            </div>

                            <div>
                                {fields.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => remove(index)}
                                        className="btn btn-danger"
                                        style={{ padding: '8px 12px' }}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={() => append({ description: '', priority: '' })}
                        className="btn btn-secondary"
                        style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
                    >
                        <Plus size={16} />
                        Adicionar Solicitação
                    </button>
                </div>

                {/* Seção 5: Plano de Cutover */}
                <div style={{ marginBottom: '30px' }}>
                    <h3 style={{
                        borderBottom: '2px solid #6f42c1',
                        paddingBottom: '5px',
                        marginBottom: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Controller
                                name="includeCutoverPlan"
                                control={control}
                                render={({ field }) => (
                                    <input
                                        type="checkbox"
                                        checked={field.value}
                                        onChange={field.onChange}
                                    />
                                )}
                            />
                            <Rocket size={20} aria-label="Plano de Cutover" />
                            Plano de Cutover
                        </div>
                    </h3>

                    {includeCutoverPlan && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <div className="form-group">
                                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <Target size={16} aria-label="Objetivo do cutover" />
                                    Objetivo do Cutover *
                                </label>
                                <Controller
                                    name="cutoverObjective"
                                    control={control}
                                    render={({ field }) => (
                                        <textarea
                                            {...field}
                                            className="form-input"
                                            rows={3}
                                            placeholder="Descreva o objetivo do cutover..."
                                        />
                                    )}
                                />
                                {errors.cutoverObjective && <div className="error">{errors.cutoverObjective.message}</div>}
                            </div>

                            <div className="form-group">
                                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <Clock size={16} aria-label="Timeline e cronograma" />
                                    Timeline e Cronograma *
                                </label>
                                <Controller
                                    name="cutoverTimeline"
                                    control={control}
                                    render={({ field }) => (
                                        <textarea
                                            {...field}
                                            className="form-input"
                                            rows={3}
                                            placeholder="Descreva o cronograma..."
                                        />
                                    )}
                                />
                                {errors.cutoverTimeline && <div className="error">{errors.cutoverTimeline.message}</div>}
                            </div>

                            <div className="form-group">
                                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <Play size={16} aria-label="Atividades detalhadas" />
                                    Atividades Detalhadas *
                                </label>
                                <Controller
                                    name="cutoverDetailedActivities"
                                    control={control}
                                    render={({ field }) => (
                                        <textarea
                                            {...field}
                                            className="form-input"
                                            rows={4}
                                            placeholder="Liste as atividades detalhadas..."
                                        />
                                    )}
                                />
                                {errors.cutoverDetailedActivities && <div className="error">{errors.cutoverDetailedActivities.message}</div>}
                            </div>

                            <div className="form-group">
                                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <CheckCircle size={16} aria-label="Checklist de pré-cutover" />
                                    Checklist de Pré-Cutover *
                                </label>
                                <Controller
                                    name="cutoverPreChecklistActivities"
                                    control={control}
                                    render={({ field }) => (
                                        <textarea
                                            {...field}
                                            className="form-input"
                                            rows={3}
                                            placeholder="Liste as atividades de pré-checklist..."
                                        />
                                    )}
                                />
                                {errors.cutoverPreChecklistActivities && <div className="error">{errors.cutoverPreChecklistActivities.message}</div>}
                            </div>

                            <div className="form-group">
                                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <MessageSquare size={16} aria-label="Plano de comunicação" />
                                    Plano de Comunicação *
                                </label>
                                <Controller
                                    name="cutoverCommunicationPlan"
                                    control={control}
                                    render={({ field }) => (
                                        <textarea
                                            {...field}
                                            className="form-input"
                                            rows={3}
                                            placeholder="Descreva o plano de comunicação..."
                                        />
                                    )}
                                />
                                {errors.cutoverCommunicationPlan && <div className="error">{errors.cutoverCommunicationPlan.message}</div>}
                            </div>

                            <div className="form-group">
                                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <Users size={16} aria-label="Equipes envolvidas e responsabilidades" />
                                    Equipes Envolvidas e Responsabilidades *
                                </label>
                                <Controller
                                    name="cutoverTeamsAndResponsibilities"
                                    control={control}
                                    render={({ field }) => (
                                        <textarea
                                            {...field}
                                            className="form-input"
                                            rows={3}
                                            placeholder="Descreva os times e responsabilidades..."
                                        />
                                    )}
                                />
                                {errors.cutoverTeamsAndResponsibilities && <div className="error">{errors.cutoverTeamsAndResponsibilities.message}</div>}
                            </div>

                            <div className="form-group">
                                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <Shield size={16} aria-label="Plano de contingência" />
                                    Plano de Contingência *
                                </label>
                                <Controller
                                    name="cutoverContingencyPlan"
                                    control={control}
                                    render={({ field }) => (
                                        <textarea
                                            {...field}
                                            className="form-input"
                                            rows={3}
                                            placeholder="Descreva o plano de contingência..."
                                        />
                                    )}
                                />
                                {errors.cutoverContingencyPlan && <div className="error">{errors.cutoverContingencyPlan.message}</div>}
                            </div>

                            <div className="form-group">
                                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <CheckCircle size={16} aria-label="Critérios de sucesso / Go-Live" />
                                    Critérios de Sucesso / Go-Live *
                                </label>
                                <Controller
                                    name="cutoverSuccessCriteria"
                                    control={control}
                                    render={({ field }) => (
                                        <textarea
                                            {...field}
                                            className="form-input"
                                            rows={3}
                                            placeholder="Defina os critérios de sucesso..."
                                        />
                                    )}
                                />
                                {errors.cutoverSuccessCriteria && <div className="error">{errors.cutoverSuccessCriteria.message}</div>}
                            </div>

                            <div className="form-group">
                                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <Headphones size={16} aria-label="Suporte pós-Go-Live" />
                                    Suporte Pós-Go-Live *
                                </label>
                                <Controller
                                    name="cutoverPostGoLiveSupport"
                                    control={control}
                                    render={({ field }) => (
                                        <textarea
                                            {...field}
                                            className="form-input"
                                            rows={3}
                                            placeholder="Descreva o suporte pós go-live..."
                                        />
                                    )}
                                />
                                {errors.cutoverPostGoLiveSupport && <div className="error">{errors.cutoverPostGoLiveSupport.message}</div>}
                            </div>
                        </div>
                    )}
                </div>

                {/* Seção 6: Upload de Arquivos */}
                <div style={{ marginBottom: '30px' }}>
                    <h3 style={{
                        borderBottom: '2px solid #fd7e14',
                        paddingBottom: '5px',
                        marginBottom: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        <Upload size={20} />
                        Arquivos Anexos
                        {mode === 'edit' && (
                            <span style={{ fontSize: '12px', color: '#666', fontWeight: 'normal' }}>
                                (Selecione novos arquivos para substituir os existentes)
                            </span>
                        )}
                    </h3>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div className="form-group">
                            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <FileText size={16} aria-label="Diagrama do processo" />
                                Diagrama do Processo
                            </label>
                            <input
                                type="file"
                                onChange={handleProcessDiagramUpload}
                                className="form-input"
                                accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx"
                            />
                            {processDiagram && (
                                <div style={{ marginTop: '5px', color: '#28a745', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <CheckCircle size={12} />
                                    Arquivo selecionado: {processDiagram.name}
                                </div>
                            )}
                            {mode === 'edit' && specification?.processdiagram && !processDiagram && (
                                <div style={{ marginTop: '5px', color: '#007bff', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <Folder size={12} />
                                    Arquivo atual: {specification.processdiagram.originalName}
                                </div>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Folder size={16} aria-label="Testes unitários" />
                                Testes Unitários
                            </label>
                            <input
                                type="file"
                                multiple
                                onChange={handleUnitTestsUpload}
                                className="form-input"
                                accept=".js,.py,.java,.cs,.txt,.ts,.jpg,.jpeg,.png,.gif,.pdf,.doc,.docx"
                            />
                            {unitTestFiles.length > 0 && (
                                <div style={{ marginTop: '10px' }}>
                                    <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#28a745', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <CheckCircle size={12} />
                                        {unitTestFiles.length} arquivo(s) selecionado(s):
                                    </p>
                                    {unitTestFiles.map((file, index) => (
                                        <div key={index} style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            padding: '2px 0',
                                            fontSize: '11px'
                                        }}>
                                            <span>{file.name}</span>
                                            <button
                                                type="button"
                                                onClick={() => removeUnitTestFile(index)}
                                                style={{
                                                    background: 'none',
                                                    border: 'none',
                                                    color: '#dc3545',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {mode === 'edit' && specification?.unitTests && specification.unitTests.length > 0 && unitTestFiles.length === 0 && (
                                <div style={{ marginTop: '5px', color: '#007bff', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <Folder size={12} />
                                    {specification.unitTests.length} arquivo(s) atual(is): {specification.unitTests.map(file => file.originalName).join(', ')}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Seção de Anexos Gerais */}
                    <div style={{ marginTop: '30px', borderTop: '1px solid #ddd', paddingTop: '20px' }}>
                        <h3 style={{
                            borderBottom: '2px solid #fd7e14',
                            paddingBottom: '5px',
                            marginBottom: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            <Upload size={20} />
                            Anexos Gerais
                        </h3>

                        <div className="form-group">
                            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <FileText size={16} aria-label="Anexos gerais" />
                                Selecione os arquivos
                            </label>
                            <input
                                type="file"
                                multiple
                                onChange={handleAttachmentsUpload}
                                className="form-input"
                                accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.txt,.xls,.xlsx"
                            />
                            {attachmentFiles.length > 0 && (
                                <div style={{ marginTop: '10px' }}>
                                    <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#28a745', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <CheckCircle size={12} />
                                        {attachmentFiles.length} arquivo(s) selecionado(s):
                                    </p>
                                    {attachmentFiles.map((file, index) => (
                                        <div key={index} style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            padding: '2px 0',
                                            fontSize: '11px'
                                        }}>
                                            <span>{file.name}</span>
                                            <button
                                                type="button"
                                                onClick={() => removeAttachmentFile(index)}
                                                style={{
                                                    background: 'none',
                                                    border: 'none',
                                                    color: '#dc3545',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Mostrar arquivos anexados existentes */}
                        {specification?.files && specification.files.length > 0 && (
                            <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
                                <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#495057' }}>
                                    Anexos Existentes ({specification.files.length})
                                </h4>
                                <div style={{ display: 'grid', gap: '8px' }}>
                                    {specification.files.map((file) => (
                                        <div key={file.id} style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            padding: '8px 12px',
                                            backgroundColor: 'white',
                                            borderRadius: '4px',
                                            border: '1px solid #dee2e6'
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                                                <span style={{ fontSize: '16px' }}>{getFileIcon(file.originalName)}</span>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontSize: '13px', fontWeight: '500', color: '#495057' }}>
                                                        {file.originalName}
                                                    </div>
                                                    <div style={{ fontSize: '11px', color: '#6c757d' }}>
                                                        {formatFileSize(file.size)} • {file.mimetype}
                                                    </div>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', gap: '6px' }}>
                                                <button
                                                    type="button"
                                                    onClick={() => handleViewFile(file.id, file.originalName)}
                                                    style={{
                                                        padding: '4px 8px',
                                                        fontSize: '11px',
                                                        border: '1px solid #007bff',
                                                        backgroundColor: 'transparent',
                                                        color: '#007bff',
                                                        borderRadius: '3px',
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '3px'
                                                    }}
                                                    title={`Visualizar ${file.originalName}`}
                                                >
                                                    <span role="img" aria-label="Visualizar">👁️</span> Visualizar
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={async () => {
                                                        try {
                                                            // Busca o token público e a URL
                                                            const res = await functionalSpecificationService.generatePublicFileToken(file.id);
                                                            window.open(res.downloadUrl, '_blank');
                                                        } catch (err) {
                                                            toast.error('Erro ao obter link de download do anexo.');
                                                        }
                                                    }}
                                                    style={{
                                                        padding: '4px 8px',
                                                        fontSize: '11px',
                                                        border: '1px solid #28a745',
                                                        backgroundColor: 'transparent',
                                                        color: '#28a745',
                                                        borderRadius: '3px',
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '3px'
                                                    }}
                                                    title={`Baixar ${file.originalName}`}
                                                >
                                                    <span role="img" aria-label="Baixar">💾</span> Baixar
                                                </button>
                                                {canEdit && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteFile(file.id, file.originalName)}
                                                        style={{
                                                            padding: '4px 8px',
                                                            fontSize: '11px',
                                                            border: '1px solid #dc3545',
                                                            backgroundColor: 'transparent',
                                                            color: '#dc3545',
                                                            borderRadius: '3px',
                                                            cursor: 'pointer',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '3px'
                                                        }}
                                                        title={`Excluir ${file.originalName}`}
                                                    >
                                                        <span role="img" aria-label="Excluir">🗑️</span> Excluir
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Botões de Ação */}
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '30px' }}>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="btn btn-secondary"
                        disabled={isSubmitting}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        <X size={16} />
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="btn btn-success"
                        disabled={isSubmitting}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        {isSubmitting ? (
                            <>
                                <div className="spinner-border spinner-border-sm" role="status" style={{ width: '16px', height: '16px' }}>
                                    <span className="sr-only">Loading...</span>
                                </div>
                                Salvando...
                            </>
                        ) : (
                            <>
                                <Save size={16} />
                                {mode === 'edit' ? 'Salvar Alterações' : 'Criar Especificação'}
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FunctionalSpecificationForm;
