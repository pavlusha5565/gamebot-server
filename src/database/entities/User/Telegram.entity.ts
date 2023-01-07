import { EMPTY_SESSION } from 'src/common/middlewares/telegramSession.middleware';
import { SceneContext } from 'telegraf/typings/scenes';
import { Column, Entity, OneToOne, PrimaryColumn } from 'typeorm';
import { UserEntity } from './User.entity';

export class Telegram {
  // Telegram id (uniq. etc. 1234567890)
  @PrimaryColumn({ name: 'id', unique: true })
  id: number;

  // Telegram user public Name (UserName)
  @Column({ name: 'first_name' })
  firstName: string;

  // Telegram user id (@UserName)
  @Column({ unique: true })
  username: string;
}

@Entity('telegram')
export class TelegramEntity extends Telegram {
  @OneToOne(() => UserEntity, (usersEntity) => usersEntity.telegram)
  user: UserEntity;

  @Column({ type: 'jsonb', default: EMPTY_SESSION })
  session: SceneContext['session'];
}
