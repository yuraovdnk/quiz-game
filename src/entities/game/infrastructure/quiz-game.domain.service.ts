import { GameTypeDB } from '../types/game-types';
import { ForbiddenException } from '@nestjs/common';
import { NumberPlayer, statusAnswer, statusGame } from '../types/game-enums';

export class QuizGame {
  private numberPlayer;
  constructor(public game: GameTypeDB, private userId, private gameQuestions, private answer: string) {
    this.numberPlayer =
      this.game.firstPlayer.user.id.toString() === userId.toString()
        ? NumberPlayer.firstPlayer
        : NumberPlayer.secondPlayer;
  }
  get getQuizGame() {
    return this.game;
  }

  sendAnswer() {
    const countAnswers = this.game[this.numberPlayer].answers.length;

    const currentQuestion = this.game.questions[countAnswers];

    if (!currentQuestion) {
      throw new ForbiddenException();
    }
    const answerQuestion = this.gameQuestions.find(
      (item) => currentQuestion._id.toString() === item._id.toString(),
    );
    console.log(answerQuestion, 'gfdgfd');

    const answerStatus =
      this.answer === answerQuestion.answer.toString() ? statusAnswer.Correct : statusAnswer.Incorrect;

    const objAnswer = {
      questionId: currentQuestion._id,
      answerStatus,
      addedAt: Date.now(),
    };

    this.game[this.numberPlayer].answers.push(objAnswer);

    const isFinishGame = this.checkIsFinishGame(this.game.firstPlayer, this.game.secondPlayer);
    if (!isFinishGame) {
      const scoresPlayers = this.countScores(this.game.firstPlayer.answers, this.game.secondPlayer.answers);
      this.game.firstPlayer.score = scoresPlayers.countScoresFirstPlayer;
      this.game.secondPlayer.score = scoresPlayers.countScoresSecondPlayer;
      this.game.finishGameDate = new Date(Date.now());
      this.game.status = statusGame.Finished;
    }
  }
  private checkIsFinishGame(firstPlayer, secondPlayer) {
    if (
      firstPlayer.answers.length === this.game.questions.length &&
      secondPlayer.answers.length === this.game.questions.length
    ) {
      return false;
    }
    return true;
  }
  private countScores(firstPlayerAnswers: any, secondPlayerAnswers: any) {
    function calcScores(playerAnswers) {
      let scorePlayer = 0;
      for (const item of playerAnswers) {
        if (item.answerStatus === statusAnswer.Correct) {
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
    return {
      countScoresFirstPlayer,
      countScoresSecondPlayer,
    };
  }
}
