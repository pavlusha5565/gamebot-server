import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameEntity } from 'src/database/entities/Game/Game.entity';
import { GameService } from './Game.service';

@Module({
  imports: [TypeOrmModule.forFeature([GameEntity])],
  providers: [GameService],
  exports: [GameService],
})
export class GameModule {}
