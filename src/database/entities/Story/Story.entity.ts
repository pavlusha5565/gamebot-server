import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '../User/User.entity';
import { StoryEventEntity } from './Event.entity';

export class Story {
  @Column()
  name: string;

  @Column({ type: 'varchar' })
  description: string;

  @Column()
  playtime: number;
}

@Entity()
export class StoryEntity extends Story {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity, { cascade: true })
  author: UserEntity;

  @OneToMany(() => StoryEventEntity, (event) => event.story)
  events: StoryEntity[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
