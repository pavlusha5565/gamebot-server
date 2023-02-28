import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Shape } from 'src/common/interfaces/utils.interface';
import { Game, GameEntity } from 'src/database/entities/Game/Game.entity';
import { checkExist } from 'src/utils/exeptions';
import { applyObject } from 'src/utils/object';
import {
  IPaginate,
  IPaginateInput,
  paginate,
} from 'src/utils/query/pagination';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { StoryService } from '../Story/Story.service';
import { UserService } from '../User/User.service';
import { IGameUpdateInput } from './Game.interfaces';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(GameEntity)
    private readonly gameRepository: Repository<GameEntity>,
    private readonly userService: UserService,
    private readonly storyService: StoryService,
  ) {}

  public async findById(id: string): Promise<GameEntity> {
    return this.queryBuilder.where('game.id = :id', { id }).getOne();
  }

  public async findByUserId(id: string): Promise<GameEntity[]> {
    return this.queryBuilder.where('user.id = :id', { id }).getMany();
  }

  public async findAllPaginate(
    page?: IPaginateInput,
  ): Promise<IPaginate<GameEntity>> {
    return paginate<GameEntity>(this.queryBuilder, page);
  }

  public async createGame(
    userId: string,
    storyId: string,
    payload?: Shape,
  ): Promise<GameEntity> {
    const gameEntity = new GameEntity();

    const user = await this.userService.findById(userId);
    const story = await this.storyService.findById(storyId);

    checkExist(user, 'User must be provided');
    checkExist(story, 'Story must be provided');

    applyObject(gameEntity, {
      user,
      story,
      event: story.startEvent,
      attributes: payload || null,
    });

    return this.gameRepository.save(gameEntity);
  }

  public async updateGame(gameId: string, payload: IGameUpdateInput) {
    const game = await this.findById(gameId);
    applyObject(game, payload);
    this.gameRepository.save(game);
  }

  public async deleteGame(gameId: string): Promise<boolean> {
    const game = await this.findById(gameId);
    await this.gameRepository.remove(game);
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
