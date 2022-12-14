import mongoose from 'mongoose';
import { GameTypeDB, CreatedGameTypeDB, QuestionType } from './types/game-types';
import { Game } from './schemas/game.schema';

export interface IQueryGameRepository {
  getFreeGame(): Promise<CreatedGameTypeDB>;
  getMyGames(userId: mongoose.Types.ObjectId): Promise<Array<GameTypeDB>>;
  getCurrentUserGame(userId: mongoose.Types.ObjectId): Promise<GameTypeDB | CreatedGameTypeDB>;
  getGameById(userId: mongoose.Types.ObjectId): Promise<Game>;
  getQuestions(): Promise<Array<QuestionType>>;
}
