import {
  Entity,
  Column,
  OneToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../User/User.entity';
import { StoryEntity } from './Story.entity';

export class Game {
  @Column()
  storyId: string;

  @Column({ type: 'varchar', array: true, default: [] })
  saveSlots: string[];
}

@Entity({ name: 'game' })
export class GameEntity extends Game {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => UserEntity, (userEntity) => userEntity.id)
  user: UserEntity;

  @OneToOne(() => StoryEntity, (storyEntity) => storyEntity.id, {
    nullable: true,
  })
  @JoinColumn({ name: 'storyId' })
  story: StoryEntity;
}
