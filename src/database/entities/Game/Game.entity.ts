import { Expose } from 'class-transformer';
import { Shape } from 'src/common/interfaces/utils.interface';
import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { StoryEventEntity } from '../Story/Event.entity';
import { StoryEntity } from '../Story/Story.entity';
import { UserEntity } from '../User/User.entity';

export class Game {
  @Column({ type: 'jsonb' })
  attributes: Shape;

  @Column({ type: 'jsonb' })
  saves: Game[];
}

@Entity({ name: 'game' })
@Expose()
export class GameEntity extends Game {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'story_id' })
  storyId: string;

  @Column({ name: 'event_id' })
  eventId: string;

  @ManyToOne(() => UserEntity, { cascade: ['remove', 'update'] })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => StoryEntity, {
    nullable: true,
    cascade: ['remove', 'update'],
  })
  @JoinColumn({ name: 'story_id' })
  story: StoryEntity;

  @ManyToOne(() => StoryEventEntity, {
    nullable: true,
    cascade: ['remove', 'update'],
  })
  @JoinColumn({ name: 'event_id' })
  event: StoryEventEntity;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
