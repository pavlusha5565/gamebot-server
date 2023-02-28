import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoryEntity } from 'src/database/entities/Story/Story.entity';
import { StoryController } from './Story.controller';
import { StoryService } from './Story.service';
import { StoryEventService } from './StoryEvent.service';
import { StoryEventEntity } from 'src/database/entities/Story/Event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StoryEntity, StoryEventEntity])],
  controllers: [StoryController],
  providers: [StoryService, StoryEventService],
  exports: [StoryService, StoryEventService],
})
export class StoryModule {}
