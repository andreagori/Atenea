import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UserStatsService } from '../user-stats/user-stats.service';
import { PrismaService } from '../prisma/prisma.service'; // ← Agregar esta importación

async function migrateUserStats() {
  console.log('🚀 Iniciando migración de estadísticas de usuarios...');
  
  const app = await NestFactory.createApplicationContext(AppModule);
  
  try {
    const userStatsService = app.get(UserStatsService);
    const prismaService = app.get(PrismaService); 

    console.log('📊 Obteniendo usuarios...');

    // Obtener todos los usuarios
    const users = await prismaService.user.findMany({
      select: { userId: true, username: true } // Agregar name para logs más informativos
    });

    console.log(`📝 Encontrados ${users.length} usuarios para procesar`);

    let processed = 0;
    let errors = 0;

    for (const user of users) {
      try {
        console.log(`📝 Procesando usuario ${user.userId} (${user.username || 'Sin nombre'})...`);
        
        const stats = await userStatsService.calculateAndUpdateUserStats(user.userId);
        
        console.log(`✅ Usuario ${user.userId} completado:`, {
          totalSessions: stats.totalSessions,
          totalStudyMin: stats.totalStudyMin,
          mostUsedStudyM: stats.mostUsedStudyM,
          mostUsedLearningM: stats.mostUsedLearningM
        });
        
        processed++;
      } catch (error) {
        console.error(`❌ Error procesando usuario ${user.userId}:`, error.message);
        errors++;
      }
    }
    
    console.log('\n🎉 Migración completada!');
    console.log(`✅ Usuarios procesados: ${processed}`);
    console.log(`❌ Errores: ${errors}`);
    
  } catch (error) {
    console.error('💥 Error durante la migración:', error);
  } finally {
    await app.close();
    console.log('🔄 Aplicación cerrada');
  }
}

migrateUserStats().catch(console.error);