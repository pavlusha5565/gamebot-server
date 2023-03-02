import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Story, StoryEntity } from 'src/database/entities/Story/Story.entity';
import { UserEntity } from 'src/database/entities/User/User.entity';
import { applyObject } from 'src/utils/object';
import { addWhere } from 'src/utils/query/queries';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { StoryEventService } from './StoryEvent.service';

@Injectable()
export class StoryService {
  constructor(
    @InjectRepository(StoryEntity)
    private readonly storyRepository: Repository<StoryEntity>,
    private readonly eventService: StoryEventService,
  ) {}

  public async findById(id: string, userId?: string): Promise<StoryEntity> {
    const query = this.queryBuilder;
    addWhere(query, {
      id: id,
      author: { id: userId },
    });
    return query.getOne();
  }

  public async createStory(
    user: UserEntity,
    payload: Partial<Story>,
  ): Promise<StoryEntity> {
    const story = new StoryEntity();
    applyObject(story, {
      user: user,
      ...payload,
    });

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
