import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigModule } from './config/app/appConfig.module';
import { TypeormRootConfigModule } from './config/database/typeormConfig.module';
import { TelegrafRootConfigModule } from './config/telegraf/telegrafConfig.module';
import { GameModule } from './modules/Game/Game.module';
import { TelegramModule } from './modules/Telegram/telegram.module';
import { UserModule } from './modules/User/User.module';

const settingModules = [
  AppConfigModule,
  TypeormRootConfigModule,
  TelegrafRootConfigModule,
];

@Module({
  imports: [...settingModules, GameModule, UserModule, TelegramModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
