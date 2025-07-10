export class FunctionalSpecification {
    id: string;
    cardNumber: string;
    projectName: string;
    technicalAnalyst: string;
    gmud?: string;
    date: Date;
    version: string;
    developmentEnvironment: 'EQ0' | 'EP0' | 'ED0';
    author: string;
    comment?: string;
    developmentDescription: string;
    functionalSpecification: string;
    changeDescription: string;
    order?: string;
    status: 'Em andamento' | 'Pronto' | 'Cancelado' | 'Em análise' | 'Aprovado';
    startDateTime: Date;
    endDateTime?: Date;

    // Cutover Plan
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

    authorId: string;
    createdAt: Date;
    updatedAt: Date;

    // Relacionamentos
    requests: FunctionalRequest[];
    files: any[];
    author_user: any;
}

export class FunctionalRequest {
    id: string;
    description: string;
    priority?: string;
    functionalSpecificationId: string;
    createdAt: Date;
}
