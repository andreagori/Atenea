import { Module } from '@nestjs/common';
import { PrismaController } from './app.controller';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from "./app.service";

@Module({
  imports: [PrismaModule],
  controllers: [PrismaController],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
