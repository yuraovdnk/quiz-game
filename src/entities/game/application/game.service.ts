import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { GameRepository } from '../game.repository';
import mongoose from 'mongoose';
import { UsersRepository } from '../../auth/users.repository';
import { answerStatuses, game } from '../types/game-types';

@Injectable()
export class GameService {
  constructor(protected gameRepository: GameRepository, protected usersRepository: UsersRepository) {}
  async myGames(userId: mongoose.Types.ObjectId) {
    return this.gameRepository.getMyGames(userId);
  }
  async myCurrentGame(userId: mongoose.Types.ObjectId) {
    return this.gameRepository.getGameByUserId(userId);
  }

  async connection(userId: mongoose.Types.ObjectId) {
    const isParticipleUser = await this.gameRepository.getGameByUserId(userId);
    if (isParticipleUser) {
      throw new ForbiddenException();
    }

    const user = await this.usersRepository.findById(userId);
    const pair = await this.gameRepository.getFreeGame();

    if (!pair) {
      const infoFirstPlayer = {
        id: user._id,
        login: user.accountData.login,
      };
      return await this.gameRepository.createGame(infoFirstPlayer);
    }

    const infoSecondPlayer = {
      id: user._id,
      login: user.accountData.login,
    };

    const gameQuestions = await this.gameRepository.getQuestions();
    await this.gameRepository.startGame(infoSecondPlayer, pair._id, gameQuestions);

    return this.gameRepository.getGameById(pair._id);
  }

  async myGameById(userId: mongoose.Types.ObjectId, gameId: mongoose.Types.ObjectId) {
    const gameById = await this.gameRepository.getGameById(gameId);
    const gameByUserId = await this.gameRepository.getGameByUserId(userId);

    if (!gameById) {
      throw new NotFoundException();
    }
    if (!gameByUserId) {
      throw new ForbiddenException();
    }

    return gameById;
  }

  async sendAnswer(userId: mongoose.Types.ObjectId, answer: string) {
    const activeGame: any = await this.gameRepository.getGameByUserId(userId);
    if (!activeGame) {
      throw new ForbiddenException();
    }
    const numberPlayer =
      activeGame.firstPlayer.user.id.toString() === userId.toString() ? game.firstPlayer : game.secondPlayer;

    const countAnswers = activeGame[numberPlayer].answers.length;

    const currentQuestion = activeGame.questions[countAnswers];

    if (!currentQuestion) {
      throw new ForbiddenException();
    }
    const answerQuestion = await this.gameRepository.getQuestionByString(currentQuestion.body);
    const answerStatus = answer === answerQuestion.answer ? answerStatuses.Correct : answerStatuses.Incorrect;

    const objAnswer = {
      questionId: currentQuestion._id,
      answerStatus,
      addedAt: Date.now(),
    };

    await this.gameRepository.sendAnswer(userId, objAnswer, numberPlayer, activeGame._id);
    const updatedGame: any = await this.gameRepository.getGameByUserId(userId);

    const answersFirstPlayer = updatedGame.firstPlayer.answers.length;
    const answersSecondPlayer = updatedGame.secondPlayer.answers.length;
    const countQuestions = updatedGame.questions.length;

    if (answersFirstPlayer === countQuestions && answersSecondPlayer === countQuestions) {
      const res = this.countScores2(updatedGame.firstPlayer.answers, updatedGame.secondPlayer.answers);

      await this.gameRepository.finishGame(updatedGame._id, res);
    }
    return objAnswer;
  }
  countScores(playerAnswers) {
    let scorePlayer = 0;
    for (const item of playerAnswers) {
      if (item.answerStatus === answerStatuses.Correct) {
        scorePlayer += 1;
      }
    }
    return scorePlayer;
  }

  countScores2(firstPlayerAnswers: any, secondPlayerAnswers: any) {
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
