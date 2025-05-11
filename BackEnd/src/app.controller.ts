import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './app.service';

@Controller()
export class PrismaController {
  constructor(private readonly prisma: PrismaService) {}

  /*
  @Get("users")
  async getUsers() {
    return this.prisma.user.findMany();
  }
  */
}