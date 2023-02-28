import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './User.entity';

export class Session {
  @Column()
  refreshToken: string;

  @Column()
  expiresIn: string;

  @Column({ name: 'last_access_at', type: 'timestamp' })
  lastAccessAt: Date;
}

@Entity('session')
export class SessionEntity extends Session {
  @PrimaryGeneratedColumn('increment')
  id: number;

  // todo manyToMany
  @OneToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;
}
