import { Ctx, Start, Update } from 'nestjs-telegraf';
import { Context } from 'telegraf';

@Update()
export class AppUpdate {
  @Start()
  async start(@Ctx() ctx: Context) {
    console.log(ctx.message.chat);
    console.log(ctx.message.from);

    ctx.reply('Hello');
  }
}
