import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { GameRepository } from '../infrastructure/game.repository';
import mongoose from 'mongoose';
import { UsersRepository } from '../../auth/users.repository';

@Injectable()
export class GameService {
  constructor(protected gameRepository: GameRepository, protected usersRepository: UsersRepository) {}
  async myGames(userId: mongoose.Types.ObjectId) {
    return this.gameRepository.getMyGames(userId);
  }
  async myCurrentGame(userId: mongoose.Types.ObjectId) {
    return this.gameRepository.getGameByUserId(userId);
  }

  async myGameById(userId: mongoose.Types.ObjectId, gameId: mongoose.Types.ObjectId) {
    const gameById = await this.gameRepository.getGameById(gameId);
    const gameByUserId = await this.gameRepository.getGameByUserId(userId);

    if (!gameById) {
      throw new NotFoundException();
    }
    if (!gameByUserId) {
      throw new ForbiddenException();
    }

    return gameById;
  }
}
