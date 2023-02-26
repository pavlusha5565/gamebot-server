import { Injectable } from '@nestjs/common';
import {
  StoryEvent,
  StoryEventEntity,
} from 'src/database/entities/Story/Event.entity';
import { StoryEntity } from 'src/database/entities/Story/Story.entity';
import { applyObject } from 'src/utils/object';
import {
  IPaginate,
  IPaginateInput,
  paginate,
} from 'src/utils/query/pagination';
import { Repository, SelectQueryBuilder } from 'typeorm';

@Injectable()
export class StoryEventService {
  constructor(private readonly storyRepository: Repository<StoryEventEntity>) {}

  async findById(id: string): Promise<StoryEventEntity> {
    return this.queryBuilder.where('event.id = :id', { id }).getOne();
  }

  async findAll(input: IPaginateInput): Promise<IPaginate<StoryEventEntity>> {
    return paginate(this.queryBuilder, input);
  }

  async createStory(
    input: StoryEvent,
    story: StoryEntity,
  ): Promise<StoryEventEntity> {
    const event = new StoryEventEntity();
    applyObject(event, { ...input, story });
    return this.storyRepository.save(event);
  }

  private get queryBuilder(): SelectQueryBuilder<StoryEventEntity> {
    const query = this.storyRepository.createQueryBuilder('event');
    query.leftJoinAndSelect('event.story', 'story');
    return query;
  }
}
