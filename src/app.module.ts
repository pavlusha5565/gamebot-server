import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TelegrafModule } from 'nestjs-telegraf';
import { session } from 'telegraf';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigModule } from './config/app/appConfig.module';
import { AppConfigService } from './config/app/appConfig.service';
import { TypeormConfigModule } from './config/database/typeormConfig.module';
import { TypeormConfigService } from './config/database/typeormConfig.service';
import { UsersModule } from './modules/Users/Users.module';

const sessionMiddleware = session();

@Module({
  imports: [
    AppConfigModule,
    UsersModule,
    TypeOrmModule.forRootAsync({
      imports: [TypeormConfigModule],
      inject: [TypeormConfigService],
      useFactory: (configService: TypeormConfigService) =>
        configService.createTypeormConfig(),
    }),
    TelegrafModule.forRootAsync({
      imports: [AppConfigModule],
      inject: [AppConfigService],
      useFactory: (configService: AppConfigService) => {
        return {
          token: configService.botToken,
          middlewares: [sessionMiddleware],
        };
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
