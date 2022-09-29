import mongoose from 'mongoose';

export enum NumberPlayer {
  firstPlayer = 'firstPlayer',
  secondPlayer = 'secondPlayer',
}

export enum answerStatuses {
  Correct = 'Correct',
  Incorrect = 'Incorrect',
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
