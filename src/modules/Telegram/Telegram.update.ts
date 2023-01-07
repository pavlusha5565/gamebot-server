import { Command, Ctx, Update } from 'nestjs-telegraf';
import {
  commandInfo,
  telegramCommands,
} from 'src/common/constants/telegramCommands.enum';
import { Context } from 'telegraf';
import { TelegramService } from './Telegram.service';

@Update()
export class TelegramUpdate {
  constructor(private readonly telegramService: TelegramService) {}

  @Command(telegramCommands.register)
  async register(@Ctx() ctx: Context) {
    const user = await this.telegramService.registerTelegramUser(ctx);
    ctx.reply(`Hello ${user.username}`);
  }

  @Command(telegramCommands.help)
  async Help(@Ctx() ctx: Context) {
    const commands = Object.keys(telegramCommands);
    const joined = commands
      .map((command) => `${command}: ${commandInfo[command]}`)
      .join('\n');
    ctx.reply(joined);
  }
}
