import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class UsersEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
