import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Shape } from 'src/common/interfaces/utils.interface';
import { Game, GameEntity } from 'src/database/entities/Game/Game.entity';
import { UserEntity } from 'src/database/entities/User/User.entity';
import { checkExist } from 'src/utils/exeptions';
import { applyObject } from 'src/utils/object';
import { Paginate, IPaginateInput, paginate } from 'src/utils/query/pagination';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { StoryService } from '../Story/Story.service';
import { StoryEventService } from '../Story/StoryEvent.service';
import { UserService } from '../User/User.service';
import { IGameUpdater } from './Game.interfaces';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(GameEntity)
    private readonly gameRepository: Repository<GameEntity>,
    private readonly userService: UserService,
    private readonly storyService: StoryService,
    private readonly eventService: StoryEventService,
  ) {}

  public async findById(id: string): Promise<GameEntity> {
    return this.queryBuilderSelect.where('game.id = :id', { id }).getOne();
  }

  public async findByUserId(
    id: string,
    page?: IPaginateInput,
  ): Promise<Paginate<GameEntity>> {
    return paginate(this.queryBuilder.where('user.id = :id', { id }), page);
  }

  public async findAll(page?: IPaginateInput): Promise<Paginate<GameEntity>> {
    return paginate(this.queryBuilder, page);
  }

  public async createGame(
    userId: string,
    payload?: Shape,
  ): Promise<GameEntity> {
    const gameEntity = new GameEntity();

    const user = await this.userService.findById(userId);

    checkExist(user, 'User must be provided');

    applyObject(gameEntity, {
      user,
      attributes: payload || null,
    });

    return this.gameRepository.save(gameEntity);
  }

  public async updateGame(
    gameId: string,
    payload: Partial<Game> & IGameUpdater,
  ): Promise<GameEntity> {
    const game = await this.findById(gameId);

    const updater: Partial<GameEntity> = payload;

    if (payload.storyId) {
      const story = await this.storyService.findById(payload.storyId);
      checkExist(story);
      updater.story = story;
    }

    if (payload.eventId) {
      const event = await this.eventService.findById(payload.eventId);
      checkExist(event);
      updater.event = event;
    }

    if (payload) applyObject(game, updater);

    return this.gameRepository.save(game);
  }

  public async deleteGame(gameId: string): Promise<GameEntity> {
    const game = await this.findById(gameId);
    return this.gameRepository.remove(game);
  }

  public async checkAuthor(user: UserEntity, game: GameEntity) {
    if (game.userId !== user.id) {
      return false;
    }
    return true;
  }

  private get queryBuilder(): SelectQueryBuilder<GameEntity> {
    const query = this.gameRepository.createQueryBuilder('game');
    query.leftJoin('game.user', 'user');
    query.leftJoin('game.story', 'story');
    query.leftJoin('game.event', 'event');
    return query;
  }

  private get queryBuilderSelect(): SelectQueryBuilder<GameEntity> {
    const query = this.queryBuilder;
    query.select('user');
    query.select('story');
    query.select('event');
    return query;
  }
}
