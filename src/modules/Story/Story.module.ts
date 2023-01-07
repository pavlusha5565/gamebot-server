import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoryEntity } from 'src/database/entities/Game/Story.entity';
import { StoryController } from './Story.controller';
import { StoryService } from './Story.service';

@Module({
  imports: [TypeOrmModule.forFeature([StoryEntity])],
  controllers: [StoryController],
  providers: [StoryService],
  exports: [StoryService],
})
export class StoryModule {}
