import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TelegrafModule } from 'nestjs-telegraf';
import { session } from 'telegraf';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigModule } from './config/app/appConfig.module';
import { AppConfigService } from './config/app/appConfig.service';
import { TypeormRootConfigModule } from './config/database/typeormConfig.module';
import { TelegrafRootConfigModule } from './config/telegraf/telegrafConfig.module';
import { UsersModule } from './modules/Users/Users.module';

@Module({
  imports: [
    AppConfigModule,
    TypeormRootConfigModule,
    TelegrafRootConfigModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
