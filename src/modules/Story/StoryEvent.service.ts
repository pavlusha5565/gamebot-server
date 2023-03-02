import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  StoryEvent,
  StoryEventEntity,
} from 'src/database/entities/Story/Event.entity';
import {
  EPrivacy,
  StoryEntity,
} from 'src/database/entities/Story/Story.entity';
import { checkExist } from 'src/utils/exeptions';
import { applyObject } from 'src/utils/object';
import { Paginate, IPaginateInput, paginate } from 'src/utils/query/pagination';
import { addWhere } from 'src/utils/query/queries';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { StoryEventSearch } from './Story.interface';

@Injectable()
export class StoryEventService {
  constructor(
    @InjectRepository(StoryEventEntity)
    private readonly storyEventRepository: Repository<StoryEventEntity>,
  ) {}

  async findById(id: string): Promise<StoryEventEntity> {
    return this.queryBuilder.where('event.id = :id', { id }).getOne();
  }

  async search(
    input: StoryEventSearch,
    page: IPaginateInput,
  ): Promise<Paginate<StoryEventEntity>> {
    const query = this.queryBuilder;
    addWhere<StoryEventEntity>(query, {
      id: input.id,
      name: input.name,
      privacy: EPrivacy.public,
      story: {
        id: input.storyId,
      },
    });
    return paginate(query, page);
  }

  async findAll(input: IPaginateInput): Promise<Paginate<StoryEventEntity>> {
    return paginate(this.queryBuilder, input);
  }

  async createEvent(
    input: StoryEvent,
    story: StoryEntity,
  ): Promise<StoryEventEntity> {
    const event = new StoryEventEntity();
    applyObject(event, { ...input, story });
    return this.storyEventRepository.save(event);
  }

  async updateEvent(
    id: string,
    payload: Partial<StoryEvent>,
  ): Promise<StoryEventEntity> {
    const event = await this.findById(id);
    applyObject(event, payload);
    return this.storyEventRepository.save(event);
  }

  async deleteEvent(id: string): Promise<boolean> {
    const event = await this.findById(id);
    checkExist(event, 'Story event not found');
    this.storyEventRepository.remove(event);
    return true;
  }

  private get queryBuilder(): SelectQueryBuilder<StoryEventEntity> {
    const query = this.storyEventRepository.createQueryBuilder('event');
    query.leftJoin('event.story', 'story');
    return query;
  }
}
