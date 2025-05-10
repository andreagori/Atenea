import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SessionResultsService } from './session-results.service';
import { CreateSessionResultDto } from './dto/create-session-result.dto';
import { UpdateSessionResultDto } from './dto/update-session-result.dto';

@Controller('session-results')
export class SessionResultsController {
  constructor(private readonly sessionResultsService: SessionResultsService) {}

  @Post()
  create(@Body() createSessionResultDto: CreateSessionResultDto) {
    return this.sessionResultsService.create(createSessionResultDto);
  }

  @Get()
  findAll() {
    return this.sessionResultsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sessionResultsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSessionResultDto: UpdateSessionResultDto) {
    return this.sessionResultsService.update(+id, updateSessionResultDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sessionResultsService.remove(+id);
  }
}
