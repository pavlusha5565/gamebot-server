import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { GameEntity } from '../Game/Game.entity';
import { TelegramEntity } from './Telegram.entity';

export class User {
  // User choosen name
  @Column({ nullable: true, unique: true })
  username: string;

  @Column({ nullable: true })
  publicname: string;

  @Column({ nullable: true, unique: true })
  email: string;

  @Column({ nullable: true })
  password: string;
}

@Entity({ name: 'user' })
export class UserEntity extends User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => TelegramEntity, (telegram) => telegram.user, {
    nullable: true,
    cascade: ['remove', 'update', 'recover'],
  })
  @JoinColumn()
  telegram: TelegramEntity;

  @Column({ default: false })
  confirmed: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
