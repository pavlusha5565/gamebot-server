import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from 'src/database/entities/Users/Users.entity';
import { GameModule } from '../Game/Game.module';
import { UsersService } from './Users.service';
import { UsersUpdate } from './Users.update';

@Module({
  imports: [TypeOrmModule.forFeature([UsersEntity]), GameModule],
  providers: [UsersUpdate, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
