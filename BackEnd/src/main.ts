import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express'; 
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule); 
  
  // ✅ CONFIGURAR ARCHIVOS ESTÁTICOS
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });
  
  // ✅ CORS CORREGIDO
  app.enableCors({
    origin: [
      'http://localhost:5173',
      'http://localhost:3000',
      'https://atenea-beige.vercel.app',  
      'https://*.vercel.app',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Origin',                    
      'X-Requested-With',         
      'Content-Type', 
      'Accept',                   
      'Authorization',
      'Cache-Control'             
    ],
    exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar'],
    optionsSuccessStatus: 200,    
  });

  app.useGlobalPipes(new ValidationPipe());
  
  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  
  console.log(`🚀 Aplicación corriendo en puerto ${port}`);
  console.log(`📁 Archivos estáticos servidos desde /uploads`);
  console.log(`🌐 CORS configurado para: https://atenea-beige.vercel.app`);
}
bootstrap();