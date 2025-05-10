import { PartialType } from '@nestjs/swagger';
import { CreateSimulatedTestDto } from './create-simulated-test.dto';

export class UpdateSimulatedTestDto extends PartialType(CreateSimulatedTestDto) {}
