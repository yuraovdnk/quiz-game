import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Game } from '../schemas/game.schema';
import { Question } from '../schemas/question.schema';
import { Injectable } from '@nestjs/common';
import { GameTypeDB, CreatedGameTypeDB, QuestionType } from '../types/game-types';
import { IQueryGameRepository } from '../interfaces';

@Injectable()
export class QueryGameRepository implements IQueryGameRepository {
  constructor(
    @InjectModel(Game.name) protected gameModel: Model<Game>,
    @InjectModel(Question.name) protected questionModel: Model<Question>,
  ) {}

  async getFreeGame(): Promise<CreatedGameTypeDB> {
    return this.gameModel.findOne({ status: 'PendingSecondPlayer' }).lean();
  }

  async getMyGames(userId: mongoose.Types.ObjectId): Promise<Array<GameTypeDB>> {
    return this.gameModel.find({
      $and: [
        {
          $or: [{ 'firstPlayer.user.id': userId }, { 'secondPlayer.user.id': userId }],
        },
        { status: { $in: ['Active', 'Finished', 'PendingSecondPlayer'] } },
      ],
    });
  }

  async getCurrentUserGame(userId: mongoose.Types.ObjectId): Promise<GameTypeDB | CreatedGameTypeDB> {
    return this.gameModel.findOne({
      $and: [
        {
          $or: [{ 'firstPlayer.user.id': userId }, { 'secondPlayer.user.id': userId }],
        },
        { status: { $in: ['Active', 'PendingSecondPlayer'] } },
      ],
    });
  }

  async getGameById(id: mongoose.Types.ObjectId): Promise<GameTypeDB | CreatedGameTypeDB> {
    return this.gameModel.findOne({ _id: id });
  }

  async getQuestions(): Promise<Array<QuestionType>> {
    //TODO add max size
    const count = await this.questionModel.countDocuments();
    return this.questionModel.aggregate([{ $sample: { size: count } }]);
  }
}
