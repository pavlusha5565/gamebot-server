import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GameEntity } from 'src/database/entities/Game/Game.entity';
import { User, UsersEntity } from 'src/database/entities/Users/Users.entity';
import { applyObject } from 'src/utils/object';
import { Repository } from 'typeorm';
import { GameService } from '../Game/Game.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private usersRepository: Repository<UsersEntity>,

    @Inject(GameService)
    private gameService: GameService,
  ) {}

  async findAll() {
    this.queryBuilder.getMany();
  }

  async addUser(user: User): Promise<UsersEntity> {
    const queryElement = await this.queryBuilder
      .where('users.userId = :id', {
        id: user.userId,
      })
      .getOne();

    if (queryElement) {
      // game create
      if (!queryElement.game) {
        const game = await this.gameService.createGame(queryElement);
        queryElement.game = game;
        this.usersRepository.save(queryElement);
      }
      return queryElement;
    }

    const userEntity = new UsersEntity();
    const game = await this.gameService.createGame(userEntity);

    applyObject(userEntity, { ...user, game: game });
    return this.usersRepository.save(userEntity);
  }

  private get queryBuilder() {
    const query = this.usersRepository.createQueryBuilder('users');
    query.leftJoinAndSelect('users.game', 'game');
    return query;
  }
}
