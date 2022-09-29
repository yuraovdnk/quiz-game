import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import mongoose from 'mongoose';
import { ForbiddenException } from '@nestjs/common';
import { answerStatuses } from '../../types/game-types';
import { GameRepository } from '../../infrastructure/game.repository';
import { QuizGame } from '../../infrastructure/quizGame';

export class SendAnswerCommand {
  constructor(public readonly userId: mongoose.Types.ObjectId, public readonly answer: string) {}
}

@CommandHandler(SendAnswerCommand)
export class SendAnswerCase implements ICommandHandler<SendAnswerCommand> {
  constructor(protected gameRepository: GameRepository) {}
  // async execute(command: SendAnswerCommand) {
  //   const { userId, answer } = command;
  //
  //   const activeGame: any = await this.gameRepository.getGameByUserId(userId);
  //   if (!activeGame) {
  //     throw new ForbiddenException();
  //   }
  //   const numberPlayer =
  //     activeGame.firstPlayer.user.id.toString() === userId.toString() ? game.firstPlayer : game.secondPlayer;
  //
  //   const countAnswers = activeGame[numberPlayer].answers.length;
  //
  //   const currentQuestion = activeGame.questions[countAnswers];
  //
  //   if (!currentQuestion) {
  //     throw new ForbiddenException();
  //   }
  //   const answerQuestion = await this.gameRepository.getQuestionByString(currentQuestion.body);
  //   const answerStatus = answer === answerQuestion.answer ? answerStatuses.Correct : answerStatuses.Incorrect;
  //
  //   const objAnswer = {
  //     questionId: currentQuestion._id,
  //     answerStatus,
  //     addedAt: Date.now(),
  //   };
  //
  //   await this.gameRepository.sendAnswer(userId, objAnswer, numberPlayer, activeGame._id);
  //   const updatedGame: any = await this.gameRepository.getGameByUserId(userId);
  //
  //   const answersFirstPlayer = updatedGame.firstPlayer.answers.length;
  //   const answersSecondPlayer = updatedGame.secondPlayer.answers.length;
  //   const countQuestions = updatedGame.questions.length;
  //
  //   if (answersFirstPlayer === countQuestions && answersSecondPlayer === countQuestions) {
  //     const res = this.countScores(updatedGame.firstPlayer.answers, updatedGame.secondPlayer.answers);
  //
  //     await this.gameRepository.finishGame(updatedGame._id, res);
  //   }
  //   return objAnswer;
  // }

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
  countScores(firstPlayerAnswers: any, secondPlayerAnswers: any) {
    function calcScores(playerAnswers) {
      let scorePlayer = 0;
      for (const item of playerAnswers) {
        if (item.answerStatus === answerStatuses.Correct) {
          scorePlayer += 1;
        }
      }
      return scorePlayer;
    }
    let countScoresFirstPlayer = calcScores(firstPlayerAnswers);
    let countScoresSecondPlayer = calcScores(secondPlayerAnswers);
    const latestFPAnswer = firstPlayerAnswers.reduce((a, b) => (a.addedAt > b.addedAt ? a : b));
    const latestSPAnswer = secondPlayerAnswers.reduce((a, b) => (a.addedAt > b.addedAt ? a : b));
    if (latestFPAnswer < latestSPAnswer) {
      countScoresFirstPlayer += 1;
    } else {
      countScoresSecondPlayer += 1;
    }
    console.log(countScoresFirstPlayer, countScoresSecondPlayer);
    return {
      countScoresFirstPlayer,
      countScoresSecondPlayer,
    };
  }
}
