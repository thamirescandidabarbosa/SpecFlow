export interface User {
    id: string;
    username: string;
    email: string;
    role: 'ADMIN' | 'ANALYST' | 'USER';
    createdAt: string;
    updatedAt: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
    role?: 'ADMIN' | 'ANALYST' | 'USER';
}

export interface AuthResponse {
    access_token: string;
    user: User;
}

export interface Document {
    id: string;
    title: string;
    description?: string;
    content?: string;
    authorId: string;
    createdAt: string;
    updatedAt: string;
    author: User;
    files: FileUpload[];
}

export interface CreateDocumentRequest {
    title: string;
    description?: string;
    content?: string;
}

export interface UpdateDocumentRequest {
    title?: string;
    description?: string;
    content?: string;
}

export interface FileUpload {
    id: string;
    filename: string;
    originalName: string;
    mimetype: string;
    size: number;
    path: string;
    uploadedById: string;
    documentId?: string;
    createdAt: string;
    uploadedBy: User;
    document?: Document;
}

// Novos tipos para Especificação Funcional
export interface FunctionalRequest {
    id: string;
    description: string;
    priority?: string;
}

export interface CutoverPlan {
    objective: string;
    timeline: string;
    detailedActivities: string;
    preChecklistActivities: string;
    communicationPlan: string;
    teamsAndResponsibilities: string;
    contingencyPlan: string;
    successCriteria: string;
    postGoLiveSupport: string;
}

export interface FunctionalSpecification {
    id: string;
    cardNumber: string;
    projectName: string;
    technicalAnalyst: string;
    gmud?: string;
    date: string;
    version: string;
    developmentEnvironment: 'EQ0' | 'EP0' | 'ED0';
    author: string;
    comment?: string;
    developmentDescription: string;
    functionalSpecification: string;
    changeDescription: string;
    processdiagram?: FileUpload;
    order?: string;
    requests: FunctionalRequest[];
    status: 'Em andamento' | 'Pronto' | 'Cancelado' | 'Em análise' | 'Aprovado';
    startDateTime: string;
    endDateTime?: string;
    unitTests?: FileUpload[];
    includeCutoverPlan: boolean;
    // Propriedades do cutover plan (estrutura achatada no backend)
    cutoverObjective?: string;
    cutoverTimeline?: string;
    cutoverDetailedActivities?: string;
    cutoverPreChecklistActivities?: string;
    cutoverCommunicationPlan?: string;
    cutoverTeamsAndResponsibilities?: string;
    cutoverContingencyPlan?: string;
    cutoverSuccessCriteria?: string;
    cutoverPostGoLiveSupport?: string;

    authorId: string;
    createdAt: string;
    updatedAt: string;
    author_user: User;
    files?: FileUpload[];
}

export interface CreateFunctionalSpecificationRequest {
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
    requests: Omit<FunctionalRequest, 'id'>[];
    status: 'Em andamento' | 'Pronto' | 'Cancelado' | 'Em análise' | 'Aprovado';
    startDateTime: string;
    endDateTime?: string;
    includeCutoverPlan: boolean;
    // Propriedades do cutover plan (estrutura achatada)
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

export interface UpdateFunctionalSpecificationRequest extends Partial<CreateFunctionalSpecificationRequest> { }
