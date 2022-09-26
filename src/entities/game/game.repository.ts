import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Game } from './schemas/game.schema';
import mongoose, { Model } from 'mongoose';
import { Question } from './schemas/question.schema';

@Injectable()
export class GameRepository {
  constructor(
    @InjectModel(Game.name) protected gameModel: Model<Game>,
    @InjectModel(Question.name) protected questionModel: Model<Question>,
  ) {}
  async getMyGames(userId: mongoose.Types.ObjectId) {
    return this.gameModel.find({
      $and: [
        {
          $or: [{ 'firstPlayer.user.id': userId }, { 'secondPlayer.user.id': userId }],
        },
        { status: { $in: ['Active', 'Finished'] } },
      ],
    });
  }
  async getFreeGame() {
    return this.gameModel.findOne({ status: 'PendingSecondPlayer' }).lean();
  }

  async startGame(secondPlayer, pairId: mongoose.Types.ObjectId, questions: Array<any>) {
    const res = await this.gameModel.updateOne(
      { _id: pairId },
      {
        $set: {
          secondPlayer: { user: secondPlayer },
          status: 'Active',
          questions,
          startGameDate: Date.now(),
        },
      },
    );
    return res.matchedCount === 1;
  }

  createGame(firstPlayer) {
    return this.gameModel.create({ firstPlayer: { user: firstPlayer } });
  }

  async getGameByUserId(userId: mongoose.Types.ObjectId) {
    return this.gameModel.findOne({
      $and: [
        {
          $or: [{ 'firstPlayer.user.id': userId }, { 'secondPlayer.user.id': userId }],
        },
        { status: { $in: ['Active', 'PendingSecondPlayer'] } },
      ],
    });
  }

  async getGameById(id: mongoose.Types.ObjectId) {
    return this.gameModel.findOne({ _id: id });
  }

  async getQuestions() {
    const count = await this.questionModel.countDocuments();
    return this.questionModel.aggregate([{ $sample: { size: count } }, { $project: { answer: 0 } }]);
  }

  async getQuestionByString(str: string) {
    return this.questionModel.findOne({ body: str });
  }

  async sendAnswer(
    userId: mongoose.Types.ObjectId,
    answer: any,
    numberPlayer: string,
    gameId: mongoose.Types.ObjectId,
  ) {
    return this.gameModel.updateOne({ _id: gameId }, { $push: { [`${numberPlayer}.answers`]: answer } });
  }

  async finishGame(gameId: mongoose.Types.ObjectId, scores) {
    return this.gameModel.updateOne(
      { _id: gameId },
      {
        $set: {
          'firstPlayer.score': scores.countScoresFirstPlayer,
          'secondPlayer.score': scores.countScoresSecondPlayer,
          status: 'Finished',
          finishGameDate: Date.now(),
        },
      },
    );
  }
}
