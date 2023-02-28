import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameEntity } from 'src/database/entities/Game/Game.entity';
import { StoryModule } from '../Story/Story.module';
import { UserModule } from '../User/User.module';
import { GameService } from './Game.service';

@Module({
  imports: [TypeOrmModule.forFeature([GameEntity]), UserModule, StoryModule],
  controllers: [],
  providers: [GameService],
  exports: [GameService],
})
export class GameModule {}
