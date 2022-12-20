import {
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UsersEntity } from '../Users/Users.entity';
import { ScenesEntity } from './Scenes.entity';

@Entity('game')
export class GameEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => UsersEntity, (usersEntity) => usersEntity.game)
  user: UsersEntity;

  @OneToOne(() => ScenesEntity, { nullable: true })
  @JoinColumn({ name: 'sceneId' })
  scene: ScenesEntity;

  @ManyToMany(() => ScenesEntity, { nullable: true })
  @JoinTable({
    name: 'LatestSceneIds',
    joinColumn: { name: 'latestScenesId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'gameId', referencedColumnName: 'id' },
  })
  latestScenes: ScenesEntity[];
}
