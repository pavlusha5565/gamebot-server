import { Ctx, Start, Update } from 'nestjs-telegraf';
import { parseTelegramUser } from 'src/utils/telegram';
import { Context } from 'telegraf';
import { UsersService } from './Users.service';

@Update()
export class UsersUpdate {
  constructor(private usersService: UsersService) {}

  @Start()
  async onStart(@Ctx() ctx: Context): Promise<string> {
    const user = parseTelegramUser(ctx);
    if (user.is_bot) {
      return 'Only human game';
    }

    const userSaved = await this.usersService.addUser({
      first_name: user.first_name,
      userId: user.id,
      name: user.first_name,
      username: user.username,
    });

    return `Привет ${userSaved.first_name}!`;
  }
}
