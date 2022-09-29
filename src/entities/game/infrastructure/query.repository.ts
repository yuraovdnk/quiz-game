import mongoose, { Model } from 'mongoose';

import { InjectModel } from '@nestjs/mongoose';
import { Game } from '../schemas/game.schema';
import { Question } from '../schemas/question.schema';

export class QueryGameRepository {
  constructor(
    @InjectModel(Game.name) protected gameModel: Model<Game>,
    @InjectModel(Question.name) protected questionModel: Model<Question>,
  ) {}
  async getFreeGame() {
    return this.gameModel.findOne({ status: 'PendingSecondPlayer' }).lean();
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
    //TODO add max size
    const count = await this.questionModel.countDocuments();
    return this.questionModel.aggregate([{ $sample: { size: count } }, { $project: { answer: 0 } }]);
  }

  async getQuestionByString(str: string) {
    return this.questionModel.findOne({ body: str });
  }
}
