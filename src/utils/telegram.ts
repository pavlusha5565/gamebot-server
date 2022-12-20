import { Context } from 'telegraf';
import { User } from 'telegraf/typings/core/types/typegram';

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
