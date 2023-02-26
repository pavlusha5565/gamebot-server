import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameEntity } from 'src/database/entities/Game/Game.entity';
import { UserModule } from '../User/User.module';
import { UserService } from '../User/User.service';
import { GameService } from './Game.service';

@Module({
  imports: [TypeOrmModule.forFeature([GameEntity]), UserModule],
  controllers: [],
  providers: [GameService, UserService],
  exports: [GameService],
})
export class GameModule {}
