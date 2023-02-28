import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Story, StoryEntity } from 'src/database/entities/Story/Story.entity';
import { UserEntity } from 'src/database/entities/User/User.entity';
import { applyObject } from 'src/utils/object';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { StoryEventService } from './StoryEvent.service';

@Injectable()
export class StoryService {
  constructor(
    @InjectRepository(StoryEntity)
    private readonly storyRepository: Repository<StoryEntity>,
    private readonly eventService: StoryEventService,
  ) {}

  public async findById(id: string): Promise<StoryEntity> {
    console.log(id);

    return this.queryBuilder.where('story.id = :id', { id }).getOne();
  }

  public async createStory(
    user: UserEntity,
    payload: Partial<Story>,
  ): Promise<StoryEntity> {
    const story = new StoryEntity();
    applyObject(story, {
      author: user,
      ...payload,
    });
    console.log(story);

    return this.storyRepository.save(story);
  }

  private get queryBuilder(): SelectQueryBuilder<StoryEntity> {
    const query = this.storyRepository.createQueryBuilder('story');
    query.leftJoinAndSelect('story.author', 'author');
    query.leftJoinAndSelect('story.startEvent', 'startEvent');
    query.leftJoinAndSelect('story.events', 'events');
    return query;
  }
}
