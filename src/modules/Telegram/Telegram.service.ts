import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ctx } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { TelegramEntity } from 'src/database/entities/User/Telegram.entity';
import { parseTelegramUser } from 'src/utils/telegram';
import { Repository, SelectQueryBuilder } from 'typeorm';
import {
  IPaginateResponse,
  IPaginateInput,
  paginate,
  IPaginate,
} from 'src/utils/query/pagination';
import { applyObject } from 'src/utils/object';
import { UserService } from '../User/User.service';
import { EMPTY_SESSION } from 'src/common/middlewares/telegramSession.middleware';

@Injectable()
export class TelegramService {
  constructor(
    @InjectRepository(TelegramEntity)
    private readonly telegramRepository: Repository<TelegramEntity>,
    @Inject(UserService)
    private readonly userService: UserService,
  ) {}

  async findById(id: number) {
    const user = await this.queryBuilder
      .where('telegram.id = :id', {
        id,
      })
      .getOne();
    return user;
  }

  async findByCtx(@Ctx() ctx: Context): Promise<TelegramEntity> {
    const telegram = parseTelegramUser(ctx);
    return this.findById(telegram.id);
  }

  async findAll(page: IPaginateInput): Promise<IPaginate<TelegramEntity[]>> {
    return paginate(this.queryBuilder, page);
  }

  /**
   * Регистрируя через телеграм всегда создается новый пользователь.
   * Если телеграм привязка удаляется (перепривязка к существующему пользователю),
   * а пользователь имеет поле confirmed === false, то и пользователя потом удаляем.
   */
  async registerTelegramUser(@Ctx() ctx: Context): Promise<TelegramEntity> {
    const userData = parseTelegramUser(ctx);
    const telegramUser = await this.findByCtx(ctx);
    if (telegramUser) {
      return telegramUser;
    }

    const telegramEntity = new TelegramEntity();
    applyObject(telegramEntity, {
      id: userData.id,
      firstName: userData.first_name,
      username: userData.username,
      session: EMPTY_SESSION,
    });
    const telegram = await this.telegramRepository.save(telegramEntity);
    await this.userService.registerByTelegram(telegramEntity);
    return telegram;
  }

  /**
   * Удаление телеграм аккаунта и удаление связанного пользователя (только если неподтвержден)
   */
  async unregisterTelegramUser(telegramId: number) {
    const telegramUser = await this.findById(telegramId);
    if (!telegramUser) {
      return;
    }
    await this.userService.removeTempUser(telegramUser.user?.id);
    await this.telegramRepository.remove(telegramUser);
  }

  private get queryBuilder(): SelectQueryBuilder<TelegramEntity> {
    const query = this.telegramRepository.createQueryBuilder('telegram');
    query.leftJoinAndSelect('telegram.user', 'user');
    return query;
  }
}
