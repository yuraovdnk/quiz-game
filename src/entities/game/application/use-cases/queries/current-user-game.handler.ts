import { ICommandHandler, QueryHandler } from '@nestjs/cqrs';
import mongoose from 'mongoose';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { QueryGameRepository } from '../../../infrastructure/query-game.repository';

export class CurrentUserGameQuery {
  constructor(
    public readonly userId: mongoose.Types.ObjectId,
    public readonly gameId: mongoose.Types.ObjectId,
  ) {}
}

@QueryHandler(CurrentUserGameQuery)
export class CurrentUserGameHandler implements ICommandHandler<CurrentUserGameQuery> {
  constructor(protected queryGameRepository: QueryGameRepository) {}
  async execute(query: CurrentUserGameQuery) {
    const { userId, gameId } = query;
    const gameById = await this.queryGameRepository.getGameById(gameId);
    const gameByUserId = await this.queryGameRepository.getCurrentUserGame(userId);

    if (!gameById) {
      throw new NotFoundException();
    }
    if (!gameByUserId) {
      throw new ForbiddenException();
    }

    return gameById;
  }
}
