import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NextFunction, Response } from 'express';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'fatal', 'error', 'warn', 'debug', 'verbose'],
  });

  app.use(helmet());
  app.use(cookieParser());

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://localhost:3000',
      'https://localhost:3001',
      'https://easygenerator-auth-fe-app.vercel.app',
      'https://easygenerator-be.onrender.com',
      'https://easygenerator-next-fe.onrender.com',
    ],
    credentials: true,
  });

  (app as any).set('etag', false);

  app.use((req: Request, res: Response, next: NextFunction) => {
    res.removeHeader('x-powered-by');
    res.removeHeader('date');
    next();
  });
  const config = new DocumentBuilder()
    .setTitle('Easygenerator Auth Backend')
    .setDescription('Full Stack Test Task for the user authentication module')
    .setVersion('1.0')
    .addTag('Easygenerator')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3001);
}
bootstrap();
