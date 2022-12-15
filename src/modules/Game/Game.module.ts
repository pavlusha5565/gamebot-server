import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GamesEntity } from 'src/database/entities/Game/Games.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GamesEntity])],
  providers: [],
  exports: [],
})
export class GameModule {}
