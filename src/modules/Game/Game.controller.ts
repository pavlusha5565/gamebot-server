import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Update } from 'nestjs-telegraf';
import { Game, GameEntity } from 'src/database/entities/Game/Game.entity';
import { ERole, UserEntity } from 'src/database/entities/User/User.entity';
import {
  checkExist,
  ForbiddenException,
  NotExistExeption,
} from 'src/utils/exeptions';
import { Paginate } from 'src/utils/query/pagination';
import { JwtAuthGuard } from '../Auth/guard/jwt-auth.guard';
import { PUser } from '../User/User.decorator';
import { IGameUpdater } from './Game.interfaces';
import { GameService } from './Game.service';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get('all')
  @UseGuards(JwtAuthGuard)
  public async findAll(
    @PUser() user: UserEntity,
  ): Promise<Paginate<GameEntity>> {
    if (user.role !== ERole.Admin) {
      throw new ForbiddenException();
    }
    return this.gameService.findAll();
  }

  @Post('new')
  @UseGuards(JwtAuthGuard)
  public async createGame(@PUser() user: UserEntity): Promise<GameEntity> {
    return this.gameService.createGame(user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  public async findById(
    @Param('id') id: string,
    @PUser() user: UserEntity,
  ): Promise<GameEntity> {
    const game = await this.gameService.findById(id);
    this.checkPermission(game, user);
    return game;
  }

  @Post(':id')
  @UseGuards(JwtAuthGuard)
  public async updateGame(
    @Param('id') id: string,
    @PUser() user: UserEntity,
    @Body() data: Game & IGameUpdater,
  ): Promise<GameEntity> {
    const game = await this.gameService.findById(id);
    this.checkPermission(game, user);
    return this.gameService.updateGame(game.id, data);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  public async deleteGame(
    @Param('id') id: string,
    @PUser() user: UserEntity,
  ): Promise<GameEntity> {
    const game = await this.gameService.findById(id);
    checkExist(game);
    this.checkPermission(game, user);
    return this.gameService.deleteGame(id);
  }

  public checkPermission(game: GameEntity, user: UserEntity) {
    if (!user || !game) {
      throw new NotExistExeption();
    }
    if (user.role === ERole.Admin) {
      return true;
    }
    if (game.userId === user.id) {
      return true;
    }
    throw new ForbiddenException();
  }
}
