import { Shape } from 'src/common/interfaces/utils.interface';
import { Game } from 'src/database/entities/Game/Game.entity';

export interface IGameUpdateInput {
  eventId: string;
  attributes?: Shape;
  saves?: Game[];
}
