import { PartialType } from '@nestjs/swagger';
import { CreateStudySessionDto } from './create-study-session.dto';

export class UpdateStudySessionDto extends PartialType(CreateStudySessionDto) {}
