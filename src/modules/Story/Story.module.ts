import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoryEntity } from 'src/database/entities/Story/Story.entity';
import { StoryService } from './Story.service';
import { StoryEventModule } from './StoryEvent/StoryEvent.module';
import { StoryEventService } from './StoryEvent/StoryEvent.service';

@Module({
  imports: [TypeOrmModule.forFeature([StoryEntity]), StoryEventModule],
  controllers: [],
  providers: [StoryService, StoryEventService],
  exports: [StoryService],
})
export class StoryModule {}
