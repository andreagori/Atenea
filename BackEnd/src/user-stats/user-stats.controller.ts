import { Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../jwt/JwtAuthGuard';
import { UserStatsService } from './user-stats.service';

@ApiTags('user-stats')
@UseGuards(JwtAuthGuard)
@Controller('user-stats')
export class UserStatsController {
  constructor(private readonly userStatsService: UserStatsService) {}

  @Get()
  @ApiResponse({ status: 200, description: 'Estadísticas básicas del usuario' })
  async getUserStats(@Request() req) {
    return this.userStatsService.getUserStats(req.user.userId);
  }

  @Get('detailed')
  @ApiResponse({ status: 200, description: 'Estadísticas detalladas del usuario' })
  async getDetailedUserStats(@Request() req) {
    return this.userStatsService.getDetailedUserStats(req.user.userId);
  }

  @Post('recalculate')
  @ApiResponse({ status: 200, description: 'Recalcula las estadísticas del usuario' })
  async recalculateUserStats(@Request() req) {
    return this.userStatsService.calculateAndUpdateUserStats(req.user.userId);
  }
}