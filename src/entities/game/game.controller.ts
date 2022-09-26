import { Body, Controller, Get, HttpCode, Param, Post, UseGuards } from '@nestjs/common';
import { GameService } from './application/game.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import mongoose from 'mongoose';
import { CommandBus } from '@nestjs/cqrs';
import { SendAnswerCommand } from './application/use-cases/send-answer.case';

@Controller('pair-game-quiz')
export class GameController {
  constructor(protected gameService: GameService, private commandBus: CommandBus) {}

  @Get('pairs/my')
  @UseGuards(JwtAuthGuard)
  async myGames(@CurrentUser() id: mongoose.Types.ObjectId) {
    return this.gameService.myGames(id);
  }

  //Вернуть текущую не законченную юзером игру
  @Get('pairs/my-current')
  @UseGuards(JwtAuthGuard)
  async myCurrentGame(@CurrentUser() id: mongoose.Types.ObjectId) {
    return this.gameService.myCurrentGame(id);
  }

  //Вернуть игру по id у которой текущий юзер принимает участиие
  @Get('pairs/:id')
  @UseGuards(JwtAuthGuard)
  async myGameById(
    @CurrentUser() userId: mongoose.Types.ObjectId,
    @Param('id') gameId: mongoose.Types.ObjectId,
  ) {
    return this.gameService.myGameById(userId, gameId);
  }

  @Post('pairs/connection')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  async connections(@CurrentUser() id: mongoose.Types.ObjectId) {
    return this.gameService.connection(id);
  }

  @Post('pairs/my-current/answers')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  async sendAnswer(@CurrentUser() id: mongoose.Types.ObjectId, @Body('answer') answer: string) {
    //return this.gameService.sendAnswer(id, answer);
    return this.commandBus.execute(new SendAnswerCommand(id, answer));
  }
}
