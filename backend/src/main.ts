import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  app.use(express.static(join(__dirname, '..', 'public')));

  app.enableCors({
    origin: [
      'http://localhost:3001',
      'https://newnop-assessment-311l.vercel.app',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  const port = Number(configService.get('PORT'));
  if (!port) {
    throw new Error('Port not defined in .env file');
  }

  await app.listen(port);
}

bootstrap();
