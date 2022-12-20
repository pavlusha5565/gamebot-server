import { Column, Entity, PrimaryColumn } from 'typeorm';
import { IStoryData } from 'src/common/interfaces/game.interfaces';

@Entity({ name: 'scenes' })
export class ScenesEntity {
  @PrimaryColumn({ unique: true })
  id: string;

  @Column()
  location: string;

  @Column()
  distance: number;

  @Column({ type: 'jsonb' })
  replies: IStoryData['replies'];

  @Column({ nullable: true, type: 'jsonb' })
  buttons: IStoryData['buttons'];

  @Column({ nullable: true, type: 'jsonb' })
  nextScene: IStoryData['nextScene'];
}
