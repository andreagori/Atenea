import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SimulatedTestsService } from './simulated-tests.service';
import { CreateSimulatedTestDto } from './dto/create-simulated-test.dto';
import { UpdateSimulatedTestDto } from './dto/update-simulated-test.dto';

@Controller('simulated-tests')
export class SimulatedTestsController {
  constructor(private readonly simulatedTestsService: SimulatedTestsService) {}

  @Post()
  create(@Body() createSimulatedTestDto: CreateSimulatedTestDto) {
    return this.simulatedTestsService.create(createSimulatedTestDto);
  }

  @Get()
  findAll() {
    return this.simulatedTestsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.simulatedTestsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSimulatedTestDto: UpdateSimulatedTestDto) {
    return this.simulatedTestsService.update(+id, updateSimulatedTestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.simulatedTestsService.remove(+id);
  }
}
