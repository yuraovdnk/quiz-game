import { ActiveGameType, answerStatuses, NumberPlayer } from '../types/game-types';
import { ForbiddenException } from '@nestjs/common';

export class QuizGame {
  private numberPlayer;
  constructor(public game: ActiveGameType, private userId, private gameQuestions, private answer: string) {
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

    const answerStatus =
      this.answer === answerQuestion.answer ? answerStatuses.Correct : answerStatuses.Incorrect;

    const objAnswer = {
      questionId: currentQuestion._id,
      answerStatus,
      addedAt: Date.now(),
    };

    this.game[this.numberPlayer].answers.push(objAnswer);

    const statusGame = this.checkIsFinishGame(this.game.firstPlayer, this.game.secondPlayer);
    if (!statusGame) {
      this.game.finishGameDate = new Date(Date.now());
      this.game.status = 'Finished';
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
}
