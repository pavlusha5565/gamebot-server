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
import { EventEntity } from '../Story/Event.entity';
import { StoryEntity } from '../Story/Story.entity';
import { UserEntity } from '../User/User.entity';

export class Game {
  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'story_id' })
  storyId: string;

  @Column({ name: 'event_id' })
  eventId: string;

  @Column({ type: 'jsonb' })
  attributes: Shape;
}

@Entity()
export class GameEntity extends Game {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'jsonb' })
  saves: Game[];

  @ManyToOne(() => UserEntity, { cascade: ['remove', 'update'] })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => StoryEntity, { cascade: ['remove', 'update'] })
  @JoinColumn({ name: 'story_id' })
  story: StoryEntity;

  @ManyToOne(() => EventEntity, { cascade: ['remove', 'update'] })
  @JoinColumn({ name: 'event_id' })
  event: EventEntity;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
