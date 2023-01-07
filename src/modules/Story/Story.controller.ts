import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { StoryEntity } from 'src/database/entities/Game/Story.entity';
import { IPaginateInput } from 'src/utils/query/pagination';
import { StoryService } from './Story.service';

@Controller('story')
export class StoryController {
  constructor(private readonly storyService: StoryService) {}

  @Get('all')
  async findAll(@Body() page: IPaginateInput) {
    return this.storyService.findAllPaginate(page);
  }

  @Get(':id')
  async findStory(@Param('id') id: string) {
    return this.storyService.findById(id);
  }

  @Post('new')
  async addStory(@Body() story: StoryEntity) {
    return this.storyService.addStory(story);
  }
}
