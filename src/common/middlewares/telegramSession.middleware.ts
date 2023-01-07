import TypeormDataSouce from '../../config/ormconfig';
import { checkTelegramBot, parseTelegramId } from 'src/utils/telegram';
import { Middleware } from 'telegraf';
import { SceneContext } from 'telegraf/typings/scenes';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { TelegramEntity } from 'src/database/entities/User/Telegram.entity';

export const EMPTY_SESSION = { __scenes: {} };

export class SessionDBManager {
  database: DataSource;

  constructor() {
    this.database = TypeormDataSouce;
    this.database.initialize();
  }

  async getSession(id: number): Promise<SceneContext['session'] | null> {
    const telegramUser = await this.queryBuilder
      .where('telegram.id = :id', { id })
      .getOne();

    if (!telegramUser) return null;

    return telegramUser.session;
  }

  async saveSession(
    id: number,
    session: SceneContext['session'],
  ): Promise<TelegramEntity> {
    const telegramUser: TelegramEntity = await this.queryBuilder
      .where('telegram.id = :id', { id })
      .getOne();

    if (!telegramUser) {
      return null;
    }

    telegramUser.session = session;

    return this.telegramRepository.save(telegramUser);
  }

  get telegramRepository(): Repository<TelegramEntity> {
    return this.database.getRepository(TelegramEntity);
  }

  get queryBuilder(): SelectQueryBuilder<TelegramEntity> {
    const query = this.telegramRepository.createQueryBuilder('telegram');
    query.leftJoinAndSelect('telegram.user', 'user');
    return query;
  }
}

export function createPostgreSQLSession(): Middleware<SceneContext> {
  const dbManager = new SessionDBManager();

  return async (ctx, next) => {
    const id = parseTelegramId(ctx);
    checkTelegramBot(ctx);

    let session: SceneContext['session'] = EMPTY_SESSION;

    Object.defineProperty(ctx, 'session', {
      get: function () {
        return session;
      },
      set: function (newValue) {
        session = Object.assign({}, newValue);
      },
    });

    session = (await dbManager.getSession(id)) || EMPTY_SESSION;

    await next();
    await dbManager.saveSession(id, session);
  };
}
