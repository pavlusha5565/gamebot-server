import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostgresErrorCode } from 'src/common/constants/postgres.enum';
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

  async findById(id: string): Promise<StoryEntity> {
    return this.queryBuilder.where('story.id = :id', { id }).getOne();
  }

  async findAllPaginate(
    page: IPaginateInput,
  ): Promise<IPaginate<StoryEntity[]>> {
    return paginate(this.queryBuilder, page);
  }

  async addStory(input: StoryEntity): Promise<StoryEntity> {
    const story = new StoryEntity();
    applyObject(story, input);
    return this.storyRepository.save(story);
  }

  async updateStory(id: string, input: StoryEntity) {
    const story = await this.findById(id);
    try {
      applyObject(story, input);
      return this.storyRepository.update({ id: id }, story);
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new HttpException(
          `Story with id ${id} already exists`,
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }

  async deleteStory(id: string): Promise<StoryEntity> {
    const story = await this.findById(id);
    return this.storyRepository.remove(story);
  }

  private get queryBuilder(): SelectQueryBuilder<StoryEntity> {
    const query = this.storyRepository.createQueryBuilder('story');
    return query;
  }
}
