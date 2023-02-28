import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common';
import { StoryEvent } from 'src/database/entities/Story/Event.entity';
import { Story, StoryEntity } from 'src/database/entities/Story/Story.entity';
import { UserEntity } from 'src/database/entities/User/User.entity';
import { checkExist } from 'src/utils/exeptions';
import { JwtAuthGuard } from '../Auth/guard/jwt-auth.guard';
import { User } from '../User/User.decorator';
import { StoryService } from './Story.service';
import { StoryEventService } from './StoryEvent.service';

@Controller('story')
@SerializeOptions({
  strategy: 'excludeAll',
})
export class StoryController {
  constructor(
    private storyService: StoryService,
    private eventService: StoryEventService,
  ) {}

  @Get(':id')
  public async findOne(@Param('id') id: string): Promise<StoryEntity> {
    return this.storyService.findById(id);
  }

  @Post('new')
  @UseGuards(JwtAuthGuard)
  public async createStory(
    @User() user: UserEntity,
    @Body() data: Partial<Story>,
  ) {
    return this.storyService.createStory(user, data);
  }

  @Post(':story/event/new')
  @UseGuards()
  public async createEvent(
    @Param('story') id: string,
    @Body() data: StoryEvent,
  ) {
    const story = await this.storyService.findById(id);
    checkExist(story);
    return this.eventService.createEvent(data, story);
  }
}
