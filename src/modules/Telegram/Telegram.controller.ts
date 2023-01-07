import { Body, Controller, Delete, Get, Param } from '@nestjs/common';
import { checkExist } from 'src/utils/exeptions';
import { IPaginateInput } from 'src/utils/query/pagination';
import { TelegramService } from './Telegram.service';

@Controller('telegram')
export class TelegramController {
  constructor(private readonly telegramServise: TelegramService) {}

  @Get('all')
  async findAll(@Body() paginate: IPaginateInput) {
    return this.telegramServise.findAll(paginate);
  }

  @Get(':id')
  async findUser(@Param('id') id: string) {
    const idNumber = Number.parseInt(id);
    const user = this.telegramServise.findById(idNumber);
    checkExist(user);
    return user;
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    const idNumber = Number.parseInt(id);
    const user = this.telegramServise.unregisterTelegramUser(idNumber);
    checkExist(user);
    return user;
  }
}
