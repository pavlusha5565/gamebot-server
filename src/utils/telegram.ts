import { Context } from 'telegraf';
import { User } from 'telegraf/typings/core/types/typegram';
import { ForbiddenException } from './exeptions';

export function parseTelegramId(context: Context): number {
  return parseTelegramUser(context)?.id || -1;
}

export function parseTelegramUser(context: Context): User | null {
  if ('callback_query' in context.update) {
    return context.update.callback_query.from;
  }

  if ('message' in context.update) {
    return context.update.message.from;
  }

  if ('my_chat_member' in context.update) {
    return context.update.my_chat_member.from;
  }

  return null;
}

export function checkTelegramBot(ctx: Context) {
  const user = parseTelegramUser(ctx);
  if (user.is_bot) {
    throw new ForbiddenException(`Bot is not supported as player`);
  }
}
