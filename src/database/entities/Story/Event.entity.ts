import { Expose } from 'class-transformer';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { IStoryData } from './Event.interface';
import { StoryEntity } from './Story.entity';

@Expose()
export class StoryEvent {
  @Column()
  name: string;

  @Column({ type: 'jsonb' })
  replies: IStoryData['replies'];

  @Column({ nullable: true, type: 'jsonb' })
  asnwers: IStoryData['answers'];

  @Column({ nullable: true, type: 'jsonb' })
  nextScene: IStoryData['nextScene'];
}

@Entity({ name: 'story_event' })
@Expose()
export class StoryEventEntity extends StoryEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => StoryEntity, (story) => story.events)
  story: StoryEntity;
}
