import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    await this.$connect();
    
    // Middleware para crear estadísticas automáticamente al crear usuarios
    this.$use(async (params, next) => {
      // Interceptar creación de usuarios
      if (params.model === 'User' && params.action === 'create') {
        const result = await next(params);
        
        // Crear estadísticas automáticamente después de crear usuario
        try {
          await this.userStats.create({
            data: {
              userId: result.userId,
              totalSessions: 0,
              totalStudyMin: 0,
              mostUsedLearningM: null,
              mostUsedStudyM: null
            }
          });
          this.logger.log(`Estadísticas creadas automáticamente para usuario ${result.userId}`);
        } catch (error) {
          this.logger.error(`Error creando estadísticas para usuario ${result.userId}:`, error.message);
        }
        
        return result;
      }
      
      return next(params);
    });
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}