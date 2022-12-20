import { ArticleEntity } from 'src/database/entities/Articles/ArticleEntity.entity';
import { ELocation } from 'src/common/interfaces/game.interfaces';

export interface GamesEntityInput {
  scene: string;
  location: ELocation;
  distance: number;
  articleStudied: ArticleEntity[];
}
