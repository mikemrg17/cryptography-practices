import { PartialType } from '@nestjs/mapped-types';
import { CreateAeDto } from './create-ae.dto';

export class UpdateAeDto extends PartialType(CreateAeDto) {}
