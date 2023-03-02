import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common';
import { StoryEventEntity } from 'src/database/entities/Story/Event.entity';
import { Story, StoryEntity } from 'src/database/entities/Story/Story.entity';
import { UserEntity } from 'src/database/entities/User/User.entity';
import { checkExist } from 'src/utils/exeptions';
import { PaginateInput } from 'src/utils/query/pagination';
import { JwtAuthGuard } from '../Auth/guard/jwt-auth.guard';
import { PUser } from '../User/User.decorator';
import { StoryService } from './Story.service';
import { StoryEventService } from './StoryEvent.service';

@Controller('story')
@SerializeOptions({
  strategy: 'exposeAll',
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
    @PUser() user: UserEntity,
    @Body() data: Partial<Story>,
  ) {
    return this.storyService.createStory(user, data);
  }

  @Get(':storyId/events')
  public async getEvents(
    @Param('storyId') storyId: string,
    @Body() input: PaginateInput<any>,
  ) {
    return this.eventService.search({ storyId: storyId }, input?.page);
  }

  @Post(':storyId/event/new')
  @UseGuards(JwtAuthGuard)
  public async createEvent(
    @Param('storyId') id: string,
    @Body() data: StoryEventEntity,
    @PUser() user: UserEntity,
  ) {
    const story = await this.storyService.findById(id, user.id);
    checkExist(story);
    return this.eventService.createEvent(data, story);
  }
}
