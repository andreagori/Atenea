import { PartialType } from '@nestjs/swagger';
import { CreateSessionResultDto } from './create-session-result.dto';

export class UpdateSessionResultDto extends PartialType(CreateSessionResultDto) {}
