import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { UserEntity } from 'src/database/entities/User/User.entity';
import { JwtAuthGuard } from '../Auth/guard/jwt-auth.guard';
import { User } from '../User/User.decorator';
import { GameService } from './Game.service';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post('new')
  @UseGuards(JwtAuthGuard)
  public async makeNewGame(@User() user: UserEntity, @Body() storyId: string) {
    this.gameService.createGame(user.id, storyId);
  }
}
