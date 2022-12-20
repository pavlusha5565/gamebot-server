import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppConfigService } from './config/app/appConfig.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn'],
  });
  const appConfig: AppConfigService = app.get(AppConfigService);
  console.log(appConfig.port);

  await app.listen(appConfig.port);
}

bootstrap();
