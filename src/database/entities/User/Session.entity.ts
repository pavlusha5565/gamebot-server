import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { UserEntity } from './User.entity';

export class Session {
  @Column()
  refreshToken: string;

  @Column({ name: 'expires_at', type: 'timestamp' })
  expiresAt: Date;

  @Column({ name: 'last_access_at', type: 'timestamp' })
  lastAccessAt: Date;

  @Column({ nullable: true })
  platform: string;

  @Column({ nullable: true })
  language: string;

  @Column({ nullable: true })
  userAgent: string;
}

@Entity('session')
export class SessionEntity extends Session {
  @PrimaryColumn('uuid')
  id: string;

  // todo manyToMany
  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;
}
