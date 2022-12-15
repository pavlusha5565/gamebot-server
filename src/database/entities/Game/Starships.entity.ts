import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { GamesEntity } from './Games.entity';

@Entity({ name: 'starships' })
export class StarshipsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  name: string;

  @OneToOne(() => GamesEntity, (gamesEntity) => gamesEntity.starship)
  game: string;

  @Column({ default: 0 })
  distanceTravaled: number;

  @Column({ default: 0 })
  techCollect: number;

  @Column({ default: 0 })
  questionComplete: number;

  @Column({ default: 100 })
  energy: number;

  @Column({ default: 100 })
  fuel: number;

  @Column({ default: 0 })
  generatorTechLevel: number;

  @Column({ default: 0 })
  engineTechLevel: number;
}
