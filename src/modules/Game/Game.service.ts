import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GameEntity } from 'src/database/entities/Game/Game.entity';
import { UsersEntity } from 'src/database/entities/Users/Users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(GameEntity)
    private GameRepository: Repository<GameEntity>,
  ) {}

  async createGame(user: UsersEntity): Promise<GameEntity> {
    const gameEntity = new GameEntity();
    gameEntity.user = user;
    return this.GameRepository.save(gameEntity);
  }

  createQueryBuilder() {
    const query = this.GameRepository.createQueryBuilder();
    query.leftJoinAndSelect('game.user', 'user');
    return query;
  }
}
