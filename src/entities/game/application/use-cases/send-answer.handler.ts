import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import mongoose from 'mongoose';
import { ForbiddenException } from '@nestjs/common';
import { statusAnswer } from '../../types/game-types';
import { GameRepository } from '../../infrastructure/game.repository';
import { QuizGame } from '../../infrastructure/quizGame';

export class SendAnswerCommand {
  constructor(public readonly userId: mongoose.Types.ObjectId, public readonly answer: string) {}
}

@CommandHandler(SendAnswerCommand)
export class SendAnswerHandler implements ICommandHandler<SendAnswerCommand> {
  constructor(protected gameRepository: GameRepository) {}
  async execute(command: SendAnswerCommand) {
    const { userId, answer } = command;
    const activeGame: any = await this.gameRepository.getGameByUserId(userId);
    if (!activeGame) {
      throw new ForbiddenException();
    }

    const gameQuestions = await this.gameRepository.getQuestions();
    const quizGame = new QuizGame(activeGame, userId, gameQuestions, answer);

    quizGame.sendAnswer();

    await this.gameRepository.saveAnswer(activeGame, quizGame.getQuizGame);

    return activeGame;
  }
}
