import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Game } from '../schemas/game.schema';
import mongoose, { Model } from 'mongoose';
import { Question } from '../schemas/question.schema';
import { GameTypeDB, PlayerType } from '../types/game-types';

@Injectable()
export class GameRepository {
  constructor(
    @InjectModel(Game.name) protected gameModel: Model<Game>,
    @InjectModel(Question.name) protected questionModel: Model<Question>,
  ) {}

  async saveAnswer(activeGame: any, gameFabric: GameTypeDB) {
    return activeGame.save(gameFabric);
  }

  async startGame(secondPlayer: PlayerType, pairId: mongoose.Types.ObjectId, questions: Array<any>) {
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

  createGame(firstPlayer: PlayerType) {
    return this.gameModel.create({ firstPlayer: { user: firstPlayer } });
  }
}
