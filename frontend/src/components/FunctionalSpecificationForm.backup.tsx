import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { functionalSpecificationService } from '../services/functionalSpecificationService';
import { CutoverPlan, FunctionalSpecification } from '../types';

interface RequestItem {
    description: string;
    priority: string;
}

export interface FormData {
    cardNumber: string;
    projectName: string;
    gmud: string;
    date: string;
    version: string;
    developmentEnvironment: string;
    comment: string;
    developmentDescription: string;
    functionalSpecification: string;
    changeDescription: string;
    order: string;
    status: string;
    startDateTime: string;
    endDateTime: string;
    requests: RequestItem[];
    includeCutoverPlan: boolean;
    cutoverPlan: CutoverPlan;
}

interface FunctionalSpecificationFormProps {
    mode: 'create' | 'edit';
    efId?: string; // ID da EF para modo de edição
    onSuccess?: () => void; // Callback para sucesso
    onCancel?: () => void; // Callback para cancelamento
}

const FunctionalSpecificationForm: React.FC<FunctionalSpecificationFormProps> = ({
    mode,
    efId,
    onSuccess,
    onCancel
}) => {
    const { user } = useAuth();

    // Estados do formulário
    const [formData, setFormData] = useState<FormData>({
        cardNumber: '',
        projectName: '',
        gmud: '',
        date: new Date().toISOString().split('T')[0],
        version: '1.0',
        developmentEnvironment: 'EQ0',
        comment: '',
        developmentDescription: '',
        functionalSpecification: '',
        changeDescription: '',
        order: '',
        requests: [{ description: '', priority: '' }],
        status: 'Em andamento',
        startDateTime: new Date().toISOString().slice(0, 16),
        endDateTime: '',
        includeCutoverPlan: false,
        cutoverPlan: {
            objective: '',
            timeline: '',
            detailedActivities: '',
            preChecklistActivities: '',
            communicationPlan: '',
            teamsAndResponsibilities: '',
            contingencyPlan: '',
            successCriteria: '',
            postGoLiveSupport: ''
        }
    });

    // Estados de upload de arquivos
    const [processDiagram, setProcessDiagram] = useState<File | null>(null);
    const [unitTestFiles, setUnitTestFiles] = useState<File[]>([]);

    // Estados de controle
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(false);
    const [canEdit, setCanEdit] = useState(true);
    const [specification, setSpecification] = useState<FunctionalSpecification | null>(null);

    // Carregar dados em modo de edição
    useEffect(() => {
        if (mode === 'edit' && efId) {
            loadSpecificationData();
        }
    }, [mode, efId]);

    const loadSpecificationData = async () => {
        try {
            setLoading(true);

            // Carregar a especificação
            const spec = await functionalSpecificationService.getById(efId!);
            setSpecification(spec);

            // Verificar permissão de edição
            const permission = await functionalSpecificationService.canEdit(efId!);
            setCanEdit(permission.canEdit);

            if (!permission.canEdit) {
                setErrors({ general: permission.message || 'Você não tem permissão para editar esta Especificação Funcional.' });
                return;
            }

            // Preencher o formulário com os dados carregados
            populateFormFromSpec(spec);

        } catch (err: any) {
            console.error('Erro ao carregar especificação:', err);
            setErrors({ general: 'Erro ao carregar especificação funcional' });
        } finally {
            setLoading(false);
        }
    };

    const populateFormFromSpec = (spec: FunctionalSpecification) => {
        setFormData({
            cardNumber: spec.cardNumber || '',
            projectName: spec.projectName || '',
            gmud: spec.gmud || '',
            date: spec.date ? new Date(spec.date).toISOString().split('T')[0] : '',
            version: spec.version || '',
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
            cutoverPlan: {
                objective: (spec as any).cutoverObjective || '',
                timeline: (spec as any).cutoverTimeline || '',
                detailedActivities: (spec as any).cutoverDetailedActivities || '',
                preChecklistActivities: (spec as any).cutoverPreChecklistActivities || '',
                communicationPlan: (spec as any).cutoverCommunicationPlan || '',
                teamsAndResponsibilities: (spec as any).cutoverTeamsAndResponsibilities || '',
                contingencyPlan: (spec as any).cutoverContingencyPlan || '',
                successCriteria: (spec as any).cutoverSuccessCriteria || '',
                postGoLiveSupport: (spec as any).cutoverPostGoLiveSupport || ''
            }
        });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Remove error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleCutoverPlanChange = (field: keyof CutoverPlan, value: string) => {
        setFormData(prev => ({
            ...prev,
            cutoverPlan: {
                ...prev.cutoverPlan,
                [field]: value
            }
        }));
    };

    const handleRequestChange = (index: number, field: 'description' | 'priority', value: string) => {
        const newRequests = [...formData.requests];
        newRequests[index][field] = value;
        setFormData(prev => ({ ...prev, requests: newRequests }));
    };

    const addRequest = () => {
        setFormData(prev => ({
            ...prev,
            requests: [...prev.requests, { description: '', priority: '' }]
        }));
    };

    const removeRequest = (index: number) => {
        if (formData.requests.length > 1) {
            setFormData(prev => ({
                ...prev,
                requests: prev.requests.filter((_, i) => i !== index)
            }));
        }
    };

    const handleProcessDiagramUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf'];
            if (!validTypes.includes(file.type)) {
                setErrors(prev => ({ ...prev, processDiagram: 'Apenas arquivos de imagem (JPEG, PNG, GIF) ou PDF são permitidos.' }));
                return;
            }
            if (file.size > 10 * 1024 * 1024) { // 10MB
                setErrors(prev => ({ ...prev, processDiagram: 'O arquivo deve ter no máximo 10MB.' }));
                return;
            }
            setProcessDiagram(file);
            setErrors(prev => ({ ...prev, processDiagram: '' }));
        }
    };

    const handleUnitTestUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            const validTypes = [
                'text/plain', 'application/javascript', 'text/javascript',
                'application/x-python-code', 'text/x-python', 'application/java-archive',
                'text/x-java-source', 'text/x-csharp'
            ];

            const invalidFiles = files.filter(file =>
                !validTypes.includes(file.type) &&
                !['.js', '.py', '.java', '.cs', '.txt', '.ts'].some(ext => file.name.toLowerCase().endsWith(ext))
            );

            if (invalidFiles.length > 0) {
                setErrors(prev => ({ ...prev, unitTests: 'Apenas arquivos de código de teste são permitidos.' }));
                return;
            }

            const oversizedFiles = files.filter(file => file.size > 5 * 1024 * 1024); // 5MB por arquivo
            if (oversizedFiles.length > 0) {
                setErrors(prev => ({ ...prev, unitTests: 'Cada arquivo deve ter no máximo 5MB.' }));
                return;
            }

            setUnitTestFiles(files);
            setErrors(prev => ({ ...prev, unitTests: '' }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: { [key: string]: string } = {};

        // Validações obrigatórias básicas
        if (!formData.cardNumber.trim()) {
            newErrors.cardNumber = 'Card Number é obrigatório';
        } else if (formData.cardNumber.trim().length < 3) {
            newErrors.cardNumber = 'Card Number deve ter pelo menos 3 caracteres';
        }

        if (!formData.projectName.trim()) {
            newErrors.projectName = 'Nome do Projeto é obrigatório';
        } else if (formData.projectName.trim().length < 3) {
            newErrors.projectName = 'Nome do Projeto deve ter pelo menos 3 caracteres';
        }

        if (!formData.date) {
            newErrors.date = 'Data é obrigatória';
        } else {
            const selectedDate = new Date(formData.date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (selectedDate < today) {
                newErrors.date = 'Data não pode ser anterior à data atual';
            }
        }

        if (!formData.developmentDescription.trim()) {
            newErrors.developmentDescription = 'Descrição do Desenvolvimento é obrigatória';
        } else if (formData.developmentDescription.trim().length < 10) {
            newErrors.developmentDescription = 'Descrição do Desenvolvimento deve ter pelo menos 10 caracteres';
        }

        if (!formData.functionalSpecification.trim()) {
            newErrors.functionalSpecification = 'Especificação Funcional é obrigatória';
        } else if (formData.functionalSpecification.trim().length < 20) {
            newErrors.functionalSpecification = 'Especificação Funcional deve ter pelo menos 20 caracteres';
        }

        if (!formData.changeDescription.trim()) {
            newErrors.changeDescription = 'Descrição da Mudança é obrigatória';
        } else if (formData.changeDescription.trim().length < 10) {
            newErrors.changeDescription = 'Descrição da Mudança deve ter pelo menos 10 caracteres';
        }

        if (!formData.startDateTime) {
            newErrors.startDateTime = 'Data/Hora de Início é obrigatória';
        } else if (formData.endDateTime) {
            const startDate = new Date(formData.startDateTime);
            const endDate = new Date(formData.endDateTime);
            if (endDate <= startDate) {
                newErrors.endDateTime = 'Data/Hora de Término deve ser posterior à Data/Hora de Início';
            }
        }

        // Validação das requests - mais rigorosa
        const invalidRequests = formData.requests.some(req =>
            !req.description.trim() ||
            req.description.trim().length < 5 ||
            !req.priority
        );
        if (invalidRequests) {
            newErrors.requests = 'Todas as solicitações devem ter descrição (mín. 5 caracteres) e prioridade preenchidas';
        }

        // Validação específica para cutover plan se habilitado - mais rigorosa
        if (formData.includeCutoverPlan) {
            if (!formData.cutoverPlan.objective.trim()) {
                newErrors.cutoverObjective = 'Objetivo do Cutover é obrigatório quando o plano está habilitado';
            } else if (formData.cutoverPlan.objective.trim().length < 10) {
                newErrors.cutoverObjective = 'Objetivo do Cutover deve ter pelo menos 10 caracteres';
            }

            if (!formData.cutoverPlan.timeline.trim()) {
                newErrors.cutoverTimeline = 'Timeline do Cutover é obrigatória quando o plano está habilitado';
            }

            if (!formData.cutoverPlan.detailedActivities.trim()) {
                newErrors.cutoverDetailedActivities = 'Atividades Detalhadas são obrigatórias quando o plano está habilitado';
            }
        }

        // Validação de arquivos
        if (processDiagram) {
            const maxSize = 10 * 1024 * 1024; // 10MB
            if (processDiagram.size > maxSize) {
                newErrors.processDiagram = 'O arquivo do diagrama deve ter no máximo 10MB';
            }
        }

        if (unitTestFiles.length > 0) {
            const maxSize = 5 * 1024 * 1024; // 5MB por arquivo
            const oversizedFiles = unitTestFiles.filter(file => file.size > maxSize);
            if (oversizedFiles.length > 0) {
                newErrors.unitTests = `${oversizedFiles.length} arquivo(s) excedem o limite de 5MB`;
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        if (!canEdit && mode === 'edit') {
            alert('Você não tem permissão para editar esta especificação.');
            return;
        }

        try {
            setIsSubmitting(true);

            if (mode === 'create') {
                await handleCreateSubmit();
            } else {
                await handleEditSubmit();
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

    const handleCreateSubmit = async () => {
        try {
            // Preparar dados para criação
            const createData = {
                cardNumber: formData.cardNumber,
                projectName: formData.projectName,
                gmud: formData.gmud,
                date: formData.date,
                version: formData.version,
                developmentEnvironment: formData.developmentEnvironment as 'EQ0' | 'EP0' | 'ED0',
                comment: formData.comment,
                developmentDescription: formData.developmentDescription,
                functionalSpecification: formData.functionalSpecification,
                changeDescription: formData.changeDescription,
                order: formData.order,
                status: formData.status as 'Em andamento' | 'Pronto' | 'Cancelado' | 'Em análise' | 'Aprovado',
                startDateTime: formData.startDateTime,
                endDateTime: formData.endDateTime,
                requests: formData.requests.map(req => ({
                    description: req.description,
                    priority: req.priority
                })),
                includeCutoverPlan: formData.includeCutoverPlan,
                ...(formData.includeCutoverPlan && {
                    cutoverObjective: formData.cutoverPlan.objective,
                    cutoverTimeline: formData.cutoverPlan.timeline,
                    cutoverDetailedActivities: formData.cutoverPlan.detailedActivities,
                    cutoverPreChecklistActivities: formData.cutoverPlan.preChecklistActivities,
                    cutoverCommunicationPlan: formData.cutoverPlan.communicationPlan,
                    cutoverTeamsAndResponsibilities: formData.cutoverPlan.teamsAndResponsibilities,
                    cutoverContingencyPlan: formData.cutoverPlan.contingencyPlan,
                    cutoverSuccessCriteria: formData.cutoverPlan.successCriteria,
                    cutoverPostGoLiveSupport: formData.cutoverPlan.postGoLiveSupport
                })
            };

            // Criar a especificação
            const createdEf = await functionalSpecificationService.create(createData);

            // Upload de arquivos se houver
            if (processDiagram) {
                await functionalSpecificationService.uploadProcessDiagram(createdEf.id, processDiagram);
            }

            if (unitTestFiles.length > 0) {
                await functionalSpecificationService.uploadUnitTests(createdEf.id, unitTestFiles);
            }

            alert('Especificação Funcional criada com sucesso!');

        } catch (error: any) {
            console.error('Erro ao criar especificação:', error);
            if (error.response?.status === 400) {
                alert('Dados inválidos. Verifique os campos e tente novamente.');
            } else {
                alert('Erro ao criar especificação. Tente novamente.');
            }
            throw error;
        }
    };

    const handleEditSubmit = async () => {
        try {
            // Preparar dados para atualização
            const updateData = {
                cardNumber: formData.cardNumber,
                projectName: formData.projectName,
                gmud: formData.gmud,
                date: formData.date,
                version: formData.version,
                developmentEnvironment: formData.developmentEnvironment as 'EQ0' | 'EP0' | 'ED0',
                comment: formData.comment,
                developmentDescription: formData.developmentDescription,
                functionalSpecification: formData.functionalSpecification,
                changeDescription: formData.changeDescription,
                order: formData.order,
                status: formData.status as 'Em andamento' | 'Pronto' | 'Cancelado' | 'Em análise' | 'Aprovado',
                startDateTime: formData.startDateTime,
                endDateTime: formData.endDateTime,
                requests: formData.requests.map(req => ({
                    description: req.description,
                    priority: req.priority
                })),
                includeCutoverPlan: formData.includeCutoverPlan,
                ...(formData.includeCutoverPlan && {
                    cutoverObjective: formData.cutoverPlan.objective,
                    cutoverTimeline: formData.cutoverPlan.timeline,
                    cutoverDetailedActivities: formData.cutoverPlan.detailedActivities,
                    cutoverPreChecklistActivities: formData.cutoverPlan.preChecklistActivities,
                    cutoverCommunicationPlan: formData.cutoverPlan.communicationPlan,
                    cutoverTeamsAndResponsibilities: formData.cutoverPlan.teamsAndResponsibilities,
                    cutoverContingencyPlan: formData.cutoverPlan.contingencyPlan,
                    cutoverSuccessCriteria: formData.cutoverPlan.successCriteria,
                    cutoverPostGoLiveSupport: formData.cutoverPlan.postGoLiveSupport
                })
            };

            // Atualizar a especificação
            await functionalSpecificationService.update(efId!, updateData);

            // Upload de arquivos se houver novos
            if (processDiagram) {
                await functionalSpecificationService.uploadProcessDiagram(efId!, processDiagram);
            }

            if (unitTestFiles.length > 0) {
                await functionalSpecificationService.uploadUnitTests(efId!, unitTestFiles);
            }

            alert('Especificação Funcional atualizada com sucesso!');

        } catch (error: any) {
            console.error('Erro ao atualizar especificação:', error);
            if (error.response?.status === 403) {
                alert('Você não tem permissão para editar esta Especificação Funcional. Apenas o autor que criou a EF pode editá-la.');
            } else if (error.response?.status === 400) {
                alert('Dados inválidos. Verifique os campos e tente novamente.');
            } else {
                alert('Erro ao atualizar especificação. Tente novamente.');
            }
            throw error;
        }
    };

    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        }
    };

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
                <div className="spinner"></div>
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
                                {errors.general || 'Apenas o autor que criou a EF pode editá-la.'}
                            </p>
                            <button
                                className="btn btn-secondary"
                                onClick={handleCancel}
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
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Informações Básicas */}
            <div className="card">
                <div className="card-header">
                    <h3>📋 Informações Básicas</h3>
                </div>
                <div className="card-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <div>
                        <label>Card Number *</label>
                        <input
                            type="text"
                            name="cardNumber"
                            value={formData.cardNumber}
                            onChange={handleInputChange}
                            className={`form-control ${errors.cardNumber ? 'is-invalid' : ''}`}
                            placeholder="Ex: CARD-2024-001"
                        />
                        {errors.cardNumber && <div className="invalid-feedback">{errors.cardNumber}</div>}
                    </div>

                    <div>
                        <label>Nome do Projeto *</label>
                        <input
                            type="text"
                            name="projectName"
                            value={formData.projectName}
                            onChange={handleInputChange}
                            className={`form-control ${errors.projectName ? 'is-invalid' : ''}`}
                            placeholder="Nome do projeto"
                        />
                        {errors.projectName && <div className="invalid-feedback">{errors.projectName}</div>}
                    </div>

                    <div>
                        <label>GMUD</label>
                        <input
                            type="text"
                            name="gmud"
                            value={formData.gmud}
                            onChange={handleInputChange}
                            className="form-control"
                            placeholder="Número da GMUD"
                        />
                    </div>

                    <div>
                        <label>Data *</label>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleInputChange}
                            className={`form-control ${errors.date ? 'is-invalid' : ''}`}
                        />
                        {errors.date && <div className="invalid-feedback">{errors.date}</div>}
                    </div>

                    <div>
                        <label>Versão</label>
                        <input
                            type="text"
                            name="version"
                            value={formData.version}
                            onChange={handleInputChange}
                            className="form-control"
                            placeholder="1.0"
                        />
                    </div>

                    <div>
                        <label>Ambiente de Desenvolvimento</label>
                        <select
                            name="developmentEnvironment"
                            value={formData.developmentEnvironment}
                            onChange={handleInputChange}
                            className="form-control"
                        >
                            <option value="EQ0">EQ0</option>
                            <option value="EP0">EP0</option>
                            <option value="ED0">ED0</option>
                        </select>
                    </div>

                    <div style={{ gridColumn: '1 / -1' }}>
                        <label>Comentários</label>
                        <textarea
                            name="comment"
                            value={formData.comment}
                            onChange={handleInputChange}
                            className="form-control"
                            rows={3}
                            placeholder="Comentários adicionais..."
                        />
                    </div>
                </div>
            </div>

            {/* Descrições */}
            <div className="card">
                <div className="card-header">
                    <h3>📝 Descrições</h3>
                </div>
                <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div>
                        <label>Descrição do Desenvolvimento *</label>
                        <textarea
                            name="developmentDescription"
                            value={formData.developmentDescription}
                            onChange={handleInputChange}
                            className={`form-control ${errors.developmentDescription ? 'is-invalid' : ''}`}
                            rows={4}
                            placeholder="Descreva o desenvolvimento que será realizado..."
                        />
                        {errors.developmentDescription && <div className="invalid-feedback">{errors.developmentDescription}</div>}
                    </div>

                    <div>
                        <label>Especificação Funcional *</label>
                        <textarea
                            name="functionalSpecification"
                            value={formData.functionalSpecification}
                            onChange={handleInputChange}
                            className={`form-control ${errors.functionalSpecification ? 'is-invalid' : ''}`}
                            rows={6}
                            placeholder="Detalhe a especificação funcional..."
                        />
                        {errors.functionalSpecification && <div className="invalid-feedback">{errors.functionalSpecification}</div>}
                    </div>

                    <div>
                        <label>Descrição da Mudança *</label>
                        <textarea
                            name="changeDescription"
                            value={formData.changeDescription}
                            onChange={handleInputChange}
                            className={`form-control ${errors.changeDescription ? 'is-invalid' : ''}`}
                            rows={4}
                            placeholder="Descreva as mudanças que serão implementadas..."
                        />
                        {errors.changeDescription && <div className="invalid-feedback">{errors.changeDescription}</div>}
                    </div>
                </div>
            </div>

            {/* Controle de Execução */}
            <div className="card">
                <div className="card-header">
                    <h3>⏱️ Controle de Execução</h3>
                </div>
                <div className="card-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
                    <div>
                        <label>Ordem</label>
                        <input
                            type="text"
                            name="order"
                            value={formData.order}
                            onChange={handleInputChange}
                            className="form-control"
                            placeholder="Ordem de execução"
                        />
                    </div>

                    <div>
                        <label>Status</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleInputChange}
                            className="form-control"
                        >
                            <option value="Em andamento">Em andamento</option>
                            <option value="Pronto">Pronto</option>
                            <option value="Cancelado">Cancelado</option>
                            <option value="Em análise">Em análise</option>
                            <option value="Aprovado">Aprovado</option>
                        </select>
                    </div>

                    <div>
                        <label>Data/Hora de Início *</label>
                        <input
                            type="datetime-local"
                            name="startDateTime"
                            value={formData.startDateTime}
                            onChange={handleInputChange}
                            className={`form-control ${errors.startDateTime ? 'is-invalid' : ''}`}
                        />
                        {errors.startDateTime && <div className="invalid-feedback">{errors.startDateTime}</div>}
                    </div>

                    <div style={{ gridColumn: '1 / -1' }}>
                        <label>Data/Hora de Término</label>
                        <input
                            type="datetime-local"
                            name="endDateTime"
                            value={formData.endDateTime}
                            onChange={handleInputChange}
                            className="form-control"
                        />
                    </div>
                </div>
            </div>

            {/* Solicitações */}
            <div className="card">
                <div className="card-header">
                    <h3>📋 Solicitações</h3>
                </div>
                <div className="card-body">
                    {formData.requests.map((request, index) => (
                        <div key={index} style={{
                            display: 'grid',
                            gridTemplateColumns: '2fr 1fr auto',
                            gap: '10px',
                            marginBottom: '15px',
                            alignItems: 'end'
                        }}>
                            <div>
                                <label>Descrição da Solicitação {index + 1}</label>
                                <textarea
                                    value={request.description}
                                    onChange={(e) => handleRequestChange(index, 'description', e.target.value)}
                                    className="form-control"
                                    rows={2}
                                    placeholder="Descreva a solicitação..."
                                />
                            </div>
                            <div>
                                <label>Prioridade</label>
                                <select
                                    value={request.priority}
                                    onChange={(e) => handleRequestChange(index, 'priority', e.target.value)}
                                    className="form-control"
                                >
                                    <option value="">Selecione...</option>
                                    <option value="Baixa">Baixa</option>
                                    <option value="Média">Média</option>
                                    <option value="Alta">Alta</option>
                                    <option value="Crítica">Crítica</option>
                                </select>
                            </div>
                            <div>
                                {formData.requests.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeRequest(index)}
                                        className="btn btn-danger"
                                        style={{ padding: '8px 12px' }}
                                    >
                                        🗑️
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}

                    {errors.requests && (
                        <div style={{ color: '#dc3545', fontSize: '14px', marginBottom: '10px' }}>
                            {errors.requests}
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={addRequest}
                        className="btn btn-secondary"
                    >
                        ➕ Adicionar Solicitação
                    </button>
                </div>
            </div>

            {/* Cutover Plan */}
            <div className="card">
                <div className="card-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <input
                            type="checkbox"
                            checked={formData.includeCutoverPlan}
                            onChange={(e) => setFormData(prev => ({ ...prev, includeCutoverPlan: e.target.checked }))}
                        />
                        <h3>🚀 Plano de Cutover</h3>
                    </div>
                </div>
                {formData.includeCutoverPlan && (
                    <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div>
                            <label>Objetivo *</label>
                            <textarea
                                value={formData.cutoverPlan.objective}
                                onChange={(e) => handleCutoverPlanChange('objective', e.target.value)}
                                className={`form-control ${errors.cutoverObjective ? 'is-invalid' : ''}`}
                                rows={3}
                                placeholder="Descreva o objetivo do cutover..."
                            />
                            {errors.cutoverObjective && <div className="invalid-feedback">{errors.cutoverObjective}</div>}
                        </div>

                        <div>
                            <label>Timeline *</label>
                            <textarea
                                value={formData.cutoverPlan.timeline}
                                onChange={(e) => handleCutoverPlanChange('timeline', e.target.value)}
                                className={`form-control ${errors.cutoverTimeline ? 'is-invalid' : ''}`}
                                rows={3}
                                placeholder="Descreva o cronograma..."
                            />
                            {errors.cutoverTimeline && <div className="invalid-feedback">{errors.cutoverTimeline}</div>}
                        </div>

                        <div>
                            <label>Atividades Detalhadas *</label>
                            <textarea
                                value={formData.cutoverPlan.detailedActivities}
                                onChange={(e) => handleCutoverPlanChange('detailedActivities', e.target.value)}
                                className={`form-control ${errors.cutoverDetailedActivities ? 'is-invalid' : ''}`}
                                rows={4}
                                placeholder="Liste as atividades detalhadas..."
                            />
                            {errors.cutoverDetailedActivities && <div className="invalid-feedback">{errors.cutoverDetailedActivities}</div>}
                        </div>

                        <div>
                            <label>Atividades de Pré-Checklist</label>
                            <textarea
                                value={formData.cutoverPlan.preChecklistActivities}
                                onChange={(e) => handleCutoverPlanChange('preChecklistActivities', e.target.value)}
                                className="form-control"
                                rows={3}
                                placeholder="Liste as atividades de pré-checklist..."
                            />
                        </div>

                        <div>
                            <label>Plano de Comunicação</label>
                            <textarea
                                value={formData.cutoverPlan.communicationPlan}
                                onChange={(e) => handleCutoverPlanChange('communicationPlan', e.target.value)}
                                className="form-control"
                                rows={3}
                                placeholder="Descreva o plano de comunicação..."
                            />
                        </div>

                        <div>
                            <label>Times e Responsabilidades</label>
                            <textarea
                                value={formData.cutoverPlan.teamsAndResponsibilities}
                                onChange={(e) => handleCutoverPlanChange('teamsAndResponsibilities', e.target.value)}
                                className="form-control"
                                rows={3}
                                placeholder="Descreva os times e responsabilidades..."
                            />
                        </div>

                        <div>
                            <label>Plano de Contingência</label>
                            <textarea
                                value={formData.cutoverPlan.contingencyPlan}
                                onChange={(e) => handleCutoverPlanChange('contingencyPlan', e.target.value)}
                                className="form-control"
                                rows={3}
                                placeholder="Descreva o plano de contingência..."
                            />
                        </div>

                        <div>
                            <label>Critérios de Sucesso</label>
                            <textarea
                                value={formData.cutoverPlan.successCriteria}
                                onChange={(e) => handleCutoverPlanChange('successCriteria', e.target.value)}
                                className="form-control"
                                rows={3}
                                placeholder="Defina os critérios de sucesso..."
                            />
                        </div>

                        <div>
                            <label>Suporte Pós Go-Live</label>
                            <textarea
                                value={formData.cutoverPlan.postGoLiveSupport}
                                onChange={(e) => handleCutoverPlanChange('postGoLiveSupport', e.target.value)}
                                className="form-control"
                                rows={3}
                                placeholder="Descreva o suporte pós go-live..."
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Upload de Arquivos - disponível para criação e edição */}
            <div className="card">
                <div className="card-header">
                    <h3>📎 Arquivos Anexos</h3>
                    {mode === 'edit' && (
                        <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#666' }}>
                            Selecione novos arquivos para substituir os existentes (opcional)
                        </p>
                    )}
                </div>
                <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div>
                        <label>Diagrama do Processo</label>
                        <input
                            type="file"
                            onChange={handleProcessDiagramUpload}
                            className={`form-control ${errors.processDiagram ? 'is-invalid' : ''}`}
                            accept=".jpg,.jpeg,.png,.gif,.pdf"
                        />
                        {errors.processDiagram && <div className="invalid-feedback">{errors.processDiagram}</div>}
                        {processDiagram && (
                            <div style={{ marginTop: '5px', color: '#28a745' }}>
                                ✅ Arquivo selecionado: {processDiagram.name}
                            </div>
                        )}
                        {mode === 'edit' && specification?.processdiagram && !processDiagram && (
                            <div style={{ marginTop: '5px', color: '#007bff', fontSize: '12px' }}>
                                📎 Arquivo atual: {specification.processdiagram.originalName}
                            </div>
                        )}
                    </div>

                    <div>
                        <label>Testes Unitários</label>
                        <input
                            type="file"
                            multiple
                            onChange={handleUnitTestUpload}
                            className={`form-control ${errors.unitTests ? 'is-invalid' : ''}`}
                            accept=".js,.py,.java,.cs,.txt,.ts"
                        />
                        {errors.unitTests && <div className="invalid-feedback">{errors.unitTests}</div>}
                        {unitTestFiles.length > 0 && (
                            <div style={{ marginTop: '5px', color: '#28a745' }}>
                                ✅ {unitTestFiles.length} arquivo(s) selecionado(s)
                            </div>
                        )}
                        {mode === 'edit' && specification?.unitTests && specification.unitTests.length > 0 && unitTestFiles.length === 0 && (
                            <div style={{ marginTop: '5px', color: '#007bff', fontSize: '12px' }}>
                                📎 {specification.unitTests.length} arquivo(s) atual(is): {specification.unitTests.map(file => file.originalName).join(', ')}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Botões de Ação */}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                    type="button"
                    onClick={onCancel}
                    className="btn btn-secondary"
                    disabled={isSubmitting}
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    className="btn btn-success"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Salvando...' : (mode === 'edit' ? 'Salvar Alterações' : 'Criar Especificação')}
                </button>
            </div>
        </form>
    );
};

export default FunctionalSpecificationForm;
