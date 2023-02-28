import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { AppConfigModule } from './config/app/appConfig.module';
import { TypeormRootConfigModule } from './config/database/typeormConfig.module';
import { AuthModule } from './modules/Auth/Auth.module';
import { GameModule } from './modules/Game/Game.module';
import { StoryModule } from './modules/Story/Story.module';
import { UserModule } from './modules/User/User.module';

const settingModules = [AppConfigModule, TypeormRootConfigModule];

@Module({
  imports: [...settingModules, AuthModule, GameModule, UserModule, StoryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
