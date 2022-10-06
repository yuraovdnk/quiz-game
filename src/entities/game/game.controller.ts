import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import mongoose from 'mongoose';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { SendAnswerCommand } from './application/use-cases/commands/send-answer.handler';
import { ConnectPlayerCommand } from './application/use-cases/commands/connect-player.handler';
import { QueryGameRepository } from './infrastructure/query-game.repository';
import { CurrentUserGameQuery } from './application/use-cases/queries/current-user-game.handler';
import { Game } from './schemas/game.schema';

@Controller('pair-game-quiz')
export class GameController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
    private queryGameRepository: QueryGameRepository,
  ) {}

  //All my games (closed and currents)
  @Get('pairs/my')
  @UseGuards(JwtAuthGuard)
  async myGames(@CurrentUser() id: mongoose.Types.ObjectId) {
    //TODO pagination
    return this.queryGameRepository.getMyGames(id);
  }

  //Current unfinished user game
  @Get('pairs/my-current')
  @UseGuards(JwtAuthGuard)
  async myCurrentGame(@CurrentUser() userId: mongoose.Types.ObjectId) {
    const res = await this.queryGameRepository.getCurrentUserGame(userId);
    if (!res) throw new NotFoundException();
    return res;
  }

  @Post('pairs/connection')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  async connections(@CurrentUser() userId: mongoose.Types.ObjectId): Promise<Game> {
    const game = await this.commandBus.execute(new ConnectPlayerCommand(userId));
    return game;
  }

  //Game in which current user took part
  @Get('pairs/:id')
  @UseGuards(JwtAuthGuard)
  async myGameById(
    @CurrentUser() userId: mongoose.Types.ObjectId,
    @Param('id') gameId: mongoose.Types.ObjectId,
  ) {
    return this.queryBus.execute(new CurrentUserGameQuery(userId, gameId));
  }

  @Post('pairs/my-current/answers')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  async sendAnswer(@CurrentUser() userId: mongoose.Types.ObjectId, @Body('answer') answer: string) {
    return this.commandBus.execute(new SendAnswerCommand(userId, answer));
  }

  @Delete('/pairs/cleardb')
  async clearDb() {
    return this.queryGameRepository.clearDb();
  }
}
