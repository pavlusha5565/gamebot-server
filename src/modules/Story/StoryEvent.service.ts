import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  StoryEvent,
  StoryEventEntity,
} from 'src/database/entities/Story/Event.entity';
import { StoryEntity } from 'src/database/entities/Story/Story.entity';
import { checkExist } from 'src/utils/exeptions';
import { applyObject } from 'src/utils/object';
import {
  IPaginate,
  IPaginateInput,
  paginate,
} from 'src/utils/query/pagination';
import { Repository, SelectQueryBuilder } from 'typeorm';

@Injectable()
export class StoryEventService {
  constructor(
    @InjectRepository(StoryEventEntity)
    private readonly storyEventRepository: Repository<StoryEventEntity>,
  ) {}

  async findById(id: string): Promise<StoryEventEntity> {
    return this.queryBuilder.where('event.id = :id', { id }).getOne();
  }

  async findAll(input: IPaginateInput): Promise<IPaginate<StoryEventEntity>> {
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
    query.leftJoinAndSelect('event.story', 'story');
    return query;
  }
}
