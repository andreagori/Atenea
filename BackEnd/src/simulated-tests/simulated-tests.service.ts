import { Injectable } from '@nestjs/common';
import { CreateSimulatedTestDto } from './dto/create-simulated-test.dto';
import { UpdateSimulatedTestDto } from './dto/update-simulated-test.dto';

@Injectable()
export class SimulatedTestsService {
  create(createSimulatedTestDto: CreateSimulatedTestDto) {
    return 'This action adds a new simulatedTest';
  }

  findAll() {
    return `This action returns all simulatedTests`;
  }

  findOne(id: number) {
    return `This action returns a #${id} simulatedTest`;
  }

  update(id: number, updateSimulatedTestDto: UpdateSimulatedTestDto) {
    return `This action updates a #${id} simulatedTest`;
  }

  remove(id: number) {
    return `This action removes a #${id} simulatedTest`;
  }
}
