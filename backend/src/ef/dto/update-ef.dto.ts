import { PartialType } from '@nestjs/mapped-types';
import { CreateFunctionalSpecificationDto } from './create-ef.dto';

export class UpdateFunctionalSpecificationDto extends PartialType(CreateFunctionalSpecificationDto) { }
