import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GameEntity } from 'src/database/entities/Game/Game.entity';
import { StoryEntity } from 'src/database/entities/Game/Story.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(GameEntity)
    private readonly gameEntity: Repository<GameEntity>,
    @InjectRepository(StoryEntity)
    private readonly story: Repository<StoryEntity>,
  ) {}

  async findById(id: string) {
    return;
  }
}
