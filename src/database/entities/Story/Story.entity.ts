import { Expose } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '../User/User.entity';
import { StoryEventEntity } from './Event.entity';

export enum EPrivacy {
  private = 'private',
  public = 'public',
}

export class Story {
  @Column()
  name: string;

  @Column({ type: 'varchar', nullable: true })
  description: string;

  @Column({ nullable: true })
  playtime: number;

  @Column({ enum: EPrivacy, default: EPrivacy.private, nullable: true })
  privacy: EPrivacy;
}

@Entity({ name: 'story' })
@Expose()
export class StoryEntity extends Story {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity, { cascade: true })
  user: UserEntity;

  @OneToOne(() => StoryEventEntity, { nullable: true })
  @JoinColumn({ name: 'start_event_id' })
  startEvent: StoryEventEntity;

  @OneToMany(() => StoryEventEntity, (event) => event.story)
  events: StoryEventEntity[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
