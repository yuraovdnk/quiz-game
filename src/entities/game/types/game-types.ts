import mongoose from 'mongoose';

export enum NumberPlayer {
  firstPlayer = 'firstPlayer',
  secondPlayer = 'secondPlayer',
}

export enum statusAnswer {
  Correct = 'Correct',
  Incorrect = 'Incorrect',
}
export enum statusGame {
  Finished = 'Finished',
  PendingSecondPlayer = 'PendingSecondPlayer',
  Active = 'Active',
}
type AnswerType = {
  questionId: mongoose.Types.ObjectId;
  answerStatus: string;
  addedAt: Date;
};

type QuestionType = {
  _id: mongoose.Types.ObjectId;
  body: string;
};

export type ActiveGameType = {
  _id: string;
  firstPlayer: {
    user: {
      id: mongoose.Types.ObjectId;
      login: string;
    };
    score: number;
    answers: [AnswerType];
  };
  secondPlayer: {
    user: {
      id: mongoose.Types.ObjectId;
      login: string;
    };
    score: number;
    answers: [AnswerType];
  };
  status: string;
  pairCreatedDate: Date;
  startGameDate: Date;
  finishGameDate: Date;
  questions: [QuestionType];
};
