import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StoryEntity } from 'src/database/entities/Story/Story.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';

@Injectable()
export class StoryService {
  constructor(
    @InjectRepository(StoryEntity)
    private readonly storyRepository: Repository<StoryEntity>,
  ) {}

  async findById(id: string) {
    return this.queryBuilder.where('story.id = :id', { id }).getOne();
  }

  private get queryBuilder(): SelectQueryBuilder<StoryEntity> {
    const query = this.storyRepository.createQueryBuilder('story');
    query.leftJoinAndSelect('story.author', 'author');
    query.leftJoinAndSelect('story.events', 'events');
    return query;
  }
}
