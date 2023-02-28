import { Controller, Get, Param } from '@nestjs/common';
import { StoryEntity } from 'src/database/entities/Story/Story.entity';
import { StoryService } from './Story.service';

@Controller('story')
export class StoryController {
  constructor(private storyService: StoryService) {}

  @Get(':id')
  findOne(@Param() id: string): Promise<StoryEntity> {
    return this.storyService.findById(id);
  }
}
