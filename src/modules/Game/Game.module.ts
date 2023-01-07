import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameEntity } from 'src/database/entities/Game/Game.entity';
import { StoryEntity } from 'src/database/entities/Game/Story.entity';
import { GameService } from './Gama.service';

@Module({
  imports: [TypeOrmModule.forFeature([GameEntity, StoryEntity])],
  providers: [GameService],
  exports: [GameService],
})
export class GameModule {}
