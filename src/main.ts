import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NextFunction, Response } from 'express';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'fatal', 'error', 'warn', 'debug', 'verbose'],
  });
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

  await app.listen(3001);
}
bootstrap();
