import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security Headers
  app.use(
    helmet({
      crossOriginResourcePolicy: false,
    }),
  );

  // CORS
  app.enableCors({
    origin: true, // Allow web & admin origins
    credentials: true,
  });

  // Global Prefix
  app.setGlobalPrefix('api/v1');

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle('Loopin V2 API')
    .setDescription('Loopin Sosyal Etkinlik ve Topluluk Platformu REST API & WebSocket Dokümantasyonu')
    .setVersion('2.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`🚀 Loopin V2 API Server running on port ${port} (http://localhost:${port}/api/v1)`);
}
bootstrap();
