import { Exclude, Expose } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum ERole {
  Admin = 'Admin',
  User = 'User',
}

export class User {
  @Column({ nullable: true, unique: true })
  @Expose()
  username: string;

  @Column({ unique: true })
  @Expose()
  email: string;

  @Column({ nullable: true })
  @Exclude()
  password: string;

  @Column({ type: 'enum', enum: ERole, default: ERole.User })
  @Expose()
  role: ERole;
}

@Entity({ name: 'user' })
export class UserEntity extends User {
  @PrimaryGeneratedColumn('uuid')
  @Expose()
  id: string;

  @Column({ default: false })
  @Expose()
  confirmed: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  @Expose()
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  @Expose()
  updatedAt: Date;
}
