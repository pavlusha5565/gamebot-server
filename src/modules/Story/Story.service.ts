import { Injectable } from '@nestjs/common';
import { StoryEntity } from 'src/database/entities/Story/Story.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StoryService {
  constructor(private readonly storyRepository: Repository<StoryEntity>) {}
}
