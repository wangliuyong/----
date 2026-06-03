import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppLogService } from './logging/app-log.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  /** 应用 error 日志写入 SQLite AppLog 表（info/warn 等仅控制台） */
  const appLog = app.get(AppLogService);
  app.useLogger(appLog);

  // 开发环境 localhost + 生产环境 CORS_ORIGIN（部署时由 docker-compose 注入）
  const corsOrigins = [
    'http://localhost:3000',
    'http://localhost:4001',
    'http://localhost:4007',
  ];
  if (process.env.CORS_ORIGIN) {
    corsOrigins.push(process.env.CORS_ORIGIN);
  }

  app.enableCors({
    origin: corsOrigins,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, transform: true }),
  );

  const port = process.env.PORT ? Number(process.env.PORT) : 3001;
  await app.listen(port, '0.0.0.0');
  console.log(`Nest API running at http://0.0.0.0:${port}`);
}

bootstrap();
