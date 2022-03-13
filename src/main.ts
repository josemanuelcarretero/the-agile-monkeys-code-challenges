import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { GlobalExceptionFilter } from './modules/common/filters/global-exception-filter.filter';
import { ValidationPipe } from '@nestjs/common';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.useGlobalFilters(new GlobalExceptionFilter());

  await app.listen(3000, '0.0.0.0');
}
bootstrap();
