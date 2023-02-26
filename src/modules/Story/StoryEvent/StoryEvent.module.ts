import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoryEventEntity } from 'src/database/entities/Story/Event.entity';
import { StoryEventService } from './StoryEvent.service';

@Module({
  imports: [TypeOrmModule.forFeature([StoryEventEntity])],
  controllers: [],
  providers: [StoryEventService],
  exports: [StoryEventService],
})
export class StoryEventModule {}
