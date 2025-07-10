import { IsString, IsOptional, IsDateString, IsIn, IsArray, ValidateNested, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateFunctionalRequestDto {
    @IsString()
    description: string;

    @IsOptional()
    @IsString()
    priority?: string;
}

export class CutoverPlanDto {
    @IsOptional()
    @IsString()
    objective?: string;

    @IsOptional()
    @IsString()
    timeline?: string;

    @IsOptional()
    @IsString()
    detailedActivities?: string;

    @IsOptional()
    @IsString()
    preChecklistActivities?: string;

    @IsOptional()
    @IsString()
    communicationPlan?: string;

    @IsOptional()
    @IsString()
    teamsAndResponsibilities?: string;

    @IsOptional()
    @IsString()
    contingencyPlan?: string;

    @IsOptional()
    @IsString()
    successCriteria?: string;

    @IsOptional()
    @IsString()
    postGoLiveSupport?: string;
}

export class CreateFunctionalSpecificationDto {
    @IsString()
    cardNumber: string;

    @IsString()
    projectName: string;

    @IsOptional()
    @IsString()
    gmud?: string;

    @IsDateString()
    date: string;

    @IsString()
    version: string;

    @IsIn(['EQ0', 'EP0', 'ED0'])
    developmentEnvironment: 'EQ0' | 'EP0' | 'ED0';

    @IsOptional()
    @IsString()
    comment?: string;

    @IsString()
    developmentDescription: string;

    @IsString()
    functionalSpecification: string;

    @IsString()
    changeDescription: string;

    @IsOptional()
    @IsString()
    order?: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateFunctionalRequestDto)
    requests: CreateFunctionalRequestDto[];

    @IsIn(['Em andamento', 'Pronto', 'Cancelado', 'Em análise', 'Aprovado'])
    status: 'Em andamento' | 'Pronto' | 'Cancelado' | 'Em análise' | 'Aprovado';

    @IsDateString()
    startDateTime: string;

    @IsOptional()
    @IsDateString()
    endDateTime?: string;

    @IsBoolean()
    includeCutoverPlan: boolean;

    @IsOptional()
    @ValidateNested()
    @Type(() => CutoverPlanDto)
    cutoverPlan?: CutoverPlanDto;
}
