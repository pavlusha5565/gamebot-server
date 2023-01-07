import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TelegramEntity } from 'src/database/entities/User/Telegram.entity';
import { UserModule } from '../User/User.module';
import { TelegramController } from './Telegram.controller';
import { TelegramService } from './Telegram.service';
import { TelegramUpdate } from './Telegram.update';

@Module({
  imports: [
    TypeOrmModule.forFeature([TelegramEntity]),
    forwardRef(() => UserModule),
  ],
  controllers: [TelegramController],
  providers: [TelegramService, TelegramUpdate],
  exports: [TelegramService],
})
export class TelegramModule {}
