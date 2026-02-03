import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  // Logger
  app.useLogger(app.get(Logger));

  const configService = app.get(ConfigService);
  const nodeEnv = configService.get('NODE_ENV');
  const jwtSecret = configService.get('JWT_SECRET');

  // Production security checks
  if (nodeEnv === 'production') {
    // Validate JWT_SECRET is not the placeholder
    const insecureSecrets = [
      'your-super-secret-key-change-in-production',
      'change-me',
      'secret',
      'jwt-secret',
    ];
    
    if (!jwtSecret || jwtSecret.length < 32) {
      throw new Error(
        'FATAL: JWT_SECRET must be at least 32 characters in production. ' +
        'Set a strong random secret in your environment variables.',
      );
    }

    if (insecureSecrets.includes(jwtSecret.toLowerCase())) {
      throw new Error(
        'FATAL: JWT_SECRET is set to an insecure placeholder value. ' +
        'Generate a secure secret: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"',
      );
    }
  }

  // Global prefix
  app.setGlobalPrefix('api');

  // Security
  app.use(helmet());

  // CORS
  app.enableCors({
    origin: configService.get('CORS_ORIGIN'),
    credentials: true,
  });

  // Cookie parser
  app.use(cookieParser());

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Swagger - only in non-production environments
  if (nodeEnv !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('EasyAuth API')
      .setDescription('Authentication API with JWT')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
  }

  const port = configService.get('PORT') || 4000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Health check available at: http://localhost:${port}/api/health`);
  
  if (nodeEnv !== 'production') {
    console.log(`Swagger docs available at: http://localhost:${port}/api/docs`);
  }
}

bootstrap();
