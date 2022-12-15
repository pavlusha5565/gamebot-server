import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TelegrafModule } from 'nestjs-telegraf';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppUpdate } from './app.update';
import { AppConfigModule } from './config/app/appConfig.module';
import { TypeormConfigModule } from './config/database/typeormConfig.module';
import { TypeormConfigService } from './config/database/typeormConfig.service';

@Module({
  imports: [
    AppConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [TypeormConfigModule],
      inject: [TypeormConfigService],
      useFactory: (configService: TypeormConfigService) =>
        configService.createTypeormConfig(),
    }),
    TelegrafModule.forRoot({
      token: process.env.TELEGRAM_API_TOKEN,
    }),
  ],
  controllers: [AppController],
  providers: [AppService, AppUpdate],
})
export class AppModule {}
