import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security Headers
  app.use(helmet());

  // Enable CORS
  app.enableCors();

  // Input Validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Strip properties that are not in the DTO
    forbidNonWhitelisted: true, // Throw error if non-whitelisted property is present
    transform: true, // Auto transform payloads to DTO instances
  }));

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
