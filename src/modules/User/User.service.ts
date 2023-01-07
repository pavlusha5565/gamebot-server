import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserEntity } from 'src/database/entities/User/User.entity';
import { TelegramEntity } from 'src/database/entities/User/Telegram.entity';
import { applyObject } from 'src/utils/object';
import {
  IPaginate,
  IPaginateInput,
  paginate,
} from 'src/utils/query/pagination';
import { TelegramService } from '../Telegram/Telegram.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    @Inject(forwardRef(() => TelegramService))
    private readonly telegramService: TelegramService,
  ) {}

  async findById(id: string): Promise<UserEntity> {
    const user = await this.queryBuilder
      .where('user.id = :id', { id })
      .getOne();
    return user;
  }

  async findByEmail(email: string): Promise<UserEntity> {
    const user = await this.queryBuilder
      .where('user.email = :email', { email })
      .getOne();
    return user;
  }

  async findAllPaginate(
    page?: IPaginateInput,
  ): Promise<IPaginate<UserEntity[]>> {
    return paginate(this.queryBuilder, page);
  }

  async findAll(): Promise<UserEntity[]> {
    return this.queryBuilder.getMany();
  }

  async addUser(user: User): Promise<UserEntity> {
    const userEntity = new UserEntity();
    applyObject(userEntity, user);
    return this.usersRepository.save(userEntity);
  }

  async registerByTelegram(telegram: TelegramEntity): Promise<UserEntity> {
    const userEntity = new UserEntity();
    applyObject(userEntity, {
      publicname: telegram.firstName,
      username: telegram.username,
      telegram: telegram,
      email: null,
      password: null,
      confirmed: false,
    });
    return this.usersRepository.save(userEntity);
  }

  /**
   * Удаление любого пользователя.
   */
  async removeUser(id: string): Promise<UserEntity> {
    const user = await this.queryBuilder
      .where('user.id = :id', { id })
      .getOne();
    return this.usersRepository.remove(user);
  }

  /**
   * Удаление неподтвержденного временного пользователя.
   */
  async removeTempUser(id: string): Promise<UserEntity> {
    const user = await this.findById(id);
    if (!user) {
      return;
    }
    if (!user.confirmed) {
      return this.usersRepository.remove(user);
    }
    return null;
  }

  private get queryBuilder() {
    const query = this.usersRepository.createQueryBuilder('user');
    query.leftJoinAndSelect('user.telegram', 'telegram');
    return query;
  }
}
