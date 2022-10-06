import mongoose from 'mongoose';

type AnswerType = {
  questionId: mongoose.Types.ObjectId;
  answerStatus: string;
  addedAt: Date;
};

export type QuestionType = {
  _id: mongoose.Types.ObjectId;
  body: string;
  answer: string;
};

export type GameTypeDB = {
  _id: mongoose.Types.ObjectId;
  firstPlayer: PlayerTypeDB;
  secondPlayer: PlayerTypeDB | null;
  status: string;
  pairCreatedDate: Date;
  startGameDate: Date;
  finishGameDate: Date | null;
  questions: [QuestionType];
};

export type CreatedGameTypeDB = {
  _id: mongoose.Types.ObjectId;
  firstPlayer: PlayerTypeDB;
  secondPlayer: null;
  status: string;
  pairCreatedDate: Date;
  startGameDate: null;
  finishGameDate: null;
};

export type PlayerTypeDB = {
  user: {
    id: mongoose.Types.ObjectId;
    login: string;
  };
  score: number;
  answers: [AnswerType];
};
export type PlayerType = {
  id: mongoose.Types.ObjectId;
  login: string;
};
