import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { GameEntity } from '../Game/Game.entity';

export class User {
  // Telegram id (1234567890)
  @Column()
  userId: number;

  // Telegram user public Name (UserName)
  @Column()
  first_name: string;

  // Telegram user id (@UserName)
  @Column()
  username: string;

  // User choosen name
  @Column({ nullable: true })
  name: string;
}

@Entity({ name: 'users' })
export class UsersEntity extends User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => GameEntity, (gameEntity) => gameEntity.user, {
    cascade: ['insert', 'remove', 'recover'],
  })
  @JoinColumn()
  game: GameEntity;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
