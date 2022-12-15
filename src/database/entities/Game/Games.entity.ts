import { ELocation } from 'src/types/game.type';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ArticleEntity } from '../Articles/ArticleEntity.entiy';
import { StarshipsEntity } from './Starships.entity';

@Entity({ name: 'game' })
export class GamesEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => StarshipsEntity, (starship) => starship.game)
  starship: StarshipsEntity;

  @Column()
  scene: string;

  @Column({ type: 'enum', enum: ELocation, default: ELocation.earth })
  location: ELocation;

  @Column()
  distance: number;

  @ManyToMany(() => ArticleEntity)
  articleStudied: ArticleEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
