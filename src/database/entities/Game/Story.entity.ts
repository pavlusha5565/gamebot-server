import { IStoryData } from 'src/common/interfaces/Story.interfaces';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'story' })
export class StoryEntity {
  @PrimaryColumn({ unique: true })
  id: string;

  @Column({ type: 'jsonb' })
  replies: IStoryData['replies'];

  @Column({ nullable: true, type: 'jsonb' })
  buttons: IStoryData['buttons'];

  @Column({ nullable: true, type: 'jsonb' })
  nextScene: IStoryData['nextScene'];
}
