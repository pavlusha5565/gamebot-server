import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GameEntity } from 'src/database/entities/Game/Game.entity';
import { checkExist } from 'src/utils/exeptions';
import { applyObject } from 'src/utils/object';
import {
  IPaginate,
  IPaginateInput,
  paginate,
} from 'src/utils/query/pagination';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { UserService } from '../User/User.service';
import { IGameUpdateInput } from './Game.interfaces';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(GameEntity)
    private readonly gameRepository: Repository<GameEntity>,
    private readonly userService: UserService,
  ) {}

  async findById(id: string): Promise<GameEntity> {
    return this.queryBuilder.where('game.id = :id', { id }).getOne();
  }

  async findByUserId(id: string): Promise<GameEntity> {
    return this.queryBuilder.where('user.id = :id', { id }).getOne();
  }

  async findAllPaginate(page?: IPaginateInput): Promise<IPaginate<GameEntity>> {
    return paginate<GameEntity>(this.queryBuilder, page);
  }

  async createGame(userId: string, storyId: string) {
    const gameEntity = new GameEntity();
    const user = await this.userService.findById(userId);
    checkExist(user, 'user must be provided');
    applyObject(gameEntity, {
      user,
      storyId,
    });
    this.gameRepository.save(gameEntity);
  }

  async updateGame(gameId: string, payload: IGameUpdateInput) {
    const game = await this.findById(gameId);
    applyObject(game, payload);
    this.gameRepository.save(game);
  }

  async deleteGame(gameId: string): Promise<boolean> {
    const game = await this.findById(gameId);
    this.gameRepository.remove(game);
    return true;
  }

  private get queryBuilder(): SelectQueryBuilder<GameEntity> {
    const query = this.gameRepository.createQueryBuilder('game');
    query.leftJoinAndSelect('game.user', 'user');
    query.leftJoinAndSelect('game.story', 'story');
    query.leftJoinAndSelect('game.event', 'event');
    return query;
  }
}
