import { Module } from '@nestjs/common';
import { SimulatedTestsService } from './simulated-tests.service';
import { SimulatedTestsController } from './simulated-tests.controller';

@Module({
  controllers: [SimulatedTestsController],
  providers: [SimulatedTestsService],
})
export class SimulatedTestsModule {}
