import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StoryEntity } from 'src/database/entities/Game/Story.entity';
import { applyObject } from 'src/utils/object';
import {
  IPaginate,
  IPaginateInput,
  paginate,
} from 'src/utils/query/pagination';
import { Repository, SelectQueryBuilder } from 'typeorm';

@Injectable()
export class StoryService {
  constructor(
    @InjectRepository(StoryEntity)
    private readonly storyRepository: Repository<StoryEntity>,
  ) {}

  findById(id: string): Promise<StoryEntity> {
    return this.queryBuilder.where('story.id = :id', { id }).getOne();
  }

  findAllPaginate(page: IPaginateInput): Promise<IPaginate<StoryEntity[]>> {
    return paginate(this.queryBuilder, page);
  }

  addStory(input: StoryEntity): Promise<StoryEntity> {
    const story = new StoryEntity();
    applyObject(story, input);
    return this.storyRepository.save(story);
  }

  private get queryBuilder(): SelectQueryBuilder<StoryEntity> {
    const query = this.storyRepository.createQueryBuilder('story');
    return query;
  }
}
