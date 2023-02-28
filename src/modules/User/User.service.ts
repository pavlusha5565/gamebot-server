import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { User, UserEntity } from 'src/database/entities/User/User.entity';
import { applyObject } from 'src/utils/object';
import {
  IPaginate,
  IPaginateInput,
  paginate,
} from 'src/utils/query/pagination';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
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

  async findAll(page?: IPaginateInput): Promise<IPaginate<UserEntity>> {
    return paginate<UserEntity>(this.queryBuilder, page, (data) =>
      data.map((user) => ({ ...user, password: undefined })),
    );
  }

  async createUser(user: User): Promise<UserEntity> {
    const userEntity = new UserEntity();
    applyObject(userEntity, user);
    return this.usersRepository.save(userEntity);
  }

  /**
   * Удаление любого пользователя.
   */
  async deleteUser(id: string): Promise<UserEntity> {
    const user = await this.queryBuilder
      .where('user.id = :id', { id })
      .getOne();
    return this.usersRepository.remove(user);
  }

  async updateUser(id: string, user: User): Promise<UserEntity> {
    const userEntity = await this.queryBuilder
      .where('user.id = :id', { id })
      .getOne();
    applyObject(userEntity, user);
    return this.usersRepository.save(userEntity);
  }

  /**
   * Удаление неподтвержденного временного пользователя.
   */
  async deleteTempUser(id: string): Promise<UserEntity> {
    const user = await this.findById(id);
    if (!user) {
      return;
    }
    if (!user.confirmed) {
      return this.usersRepository.remove(user);
    }
    return null;
  }

  private get queryBuilder(): SelectQueryBuilder<UserEntity> {
    const query = this.usersRepository.createQueryBuilder('user');
    return query;
  }
}
