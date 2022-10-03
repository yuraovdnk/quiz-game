import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import mongoose from 'mongoose';
import { ForbiddenException } from '@nestjs/common';
import { GameRepository } from '../../../infrastructure/game.repository';
import { QuizGame } from '../../../infrastructure/quiz-game.domain.service';
import { QueryGameRepository } from '../../../infrastructure/query-game.repository';

export class SendAnswerCommand {
  constructor(public readonly userId: mongoose.Types.ObjectId, public readonly answer: string) {}
}

@CommandHandler(SendAnswerCommand)
export class SendAnswerHandler implements ICommandHandler<SendAnswerCommand> {
  constructor(protected gameRepository: GameRepository, private queryGameRepository: QueryGameRepository) {}
  async execute(command: SendAnswerCommand) {
    const { userId, answer } = command;
    const activeGame: any = await this.queryGameRepository.getCurrentUserGame(userId);
    if (!activeGame) {
      throw new ForbiddenException();
    }

    const gameQuestions = await this.queryGameRepository.getQuestions();
    const quizGame = new QuizGame(activeGame, userId, gameQuestions, answer);

    quizGame.sendAnswer();

    return await this.gameRepository.saveAnswer(activeGame, quizGame.getQuizGame);
  }
}
