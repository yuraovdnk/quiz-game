import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Game } from '../schemas/game.schema';
import mongoose, { Model } from 'mongoose';
import { Question } from '../schemas/question.schema';
import { ActiveGameType } from '../types/game-types';

@Injectable()
export class GameRepository {
  constructor(
    @InjectModel(Game.name) protected gameModel: Model<Game>,
    @InjectModel(Question.name) protected questionModel: Model<Question>,
  ) {}

  async saveAnswer(activeGame: any, gameFabric: ActiveGameType) {
    activeGame.save(gameFabric);
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

  /////////////////
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

  async getGameByUserId(userId: mongoose.Types.ObjectId) {
    const model = await this.gameModel.findOne({
      $and: [
        {
          $or: [{ 'firstPlayer.user.id': userId }, { 'secondPlayer.user.id': userId }],
        },
        { status: { $in: ['Active', 'PendingSecondPlayer'] } },
      ],
    });

    return model;
  }

  async getGameById(id: mongoose.Types.ObjectId) {
    return this.gameModel.findOne({ _id: id });
  }

  async getQuestions() {
    //TODO add max size
    const count = await this.questionModel.countDocuments();
    return this.questionModel.aggregate([{ $sample: { size: count } }]);
  }

  async getQuestionByString(str: string) {
    return this.questionModel.findOne({ body: str });
  }

  // async sendAnswer(
  //   userId: mongoose.Types.ObjectId,
  //   answer: any,
  //   numberPlayer: string,
  //   gameId: mongoose.Types.ObjectId,
  // ) {
  //   return this.gameModel.updateOne({ _id: gameId }, { $push: { [`${numberPlayer}.answers`]: answer } });
  // }
}
