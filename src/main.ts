import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { CORS_OPTIONS } from './common/constants';
import * as morgan from 'morgan';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(morgan('dev')); // Log all requests to the console
  app.setGlobalPrefix('api'); // Set the global prefix for all routes
  app.enableCors(CORS_OPTIONS); // Enable CORS
  app.useGlobalPipes(
    new ValidationPipe({
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  ); // Enable validation

  const reflector = app.get('Reflector');
  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector)); // Enable transformation

  const configService = app.get(ConfigService);
  const port = configService.get('PORT');
  const url = configService.get('APP_URL');

  await app.listen(port);
  console.log(`Application is running on: ${url}`);
}
bootstrap();
