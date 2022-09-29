import mongoose from 'mongoose';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GameRepository } from '../../infrastructure/game.repository';
import { ForbiddenException } from '@nestjs/common';
import { UsersRepository } from '../../../auth/users.repository';

export class ConnectPlayerCommand {
  constructor(public readonly userId: mongoose.Types.ObjectId) {}
}

@CommandHandler(ConnectPlayerCommand)
export class ConnectPlayerHandler implements ICommandHandler<ConnectPlayerCommand> {
  constructor(private gameRepository: GameRepository, private usersRepository: UsersRepository) {}

  async execute(command: ConnectPlayerCommand) {
    const { userId } = command;

    const isParticipleUser = await this.gameRepository.getGameByUserId(userId);
    if (isParticipleUser) {
      throw new ForbiddenException();
    }

    const user = await this.usersRepository.findById(userId);
    const pair = await this.gameRepository.getFreeGame();

    if (!pair) {
      const infoFirstPlayer = {
        id: user._id,
        login: user.accountData.login,
      };
      return await this.gameRepository.createGame(infoFirstPlayer);
    }

    const infoSecondPlayer = {
      id: user._id,
      login: user.accountData.login,
    };

    const gameQuestions = await this.gameRepository.getQuestions();
    await this.gameRepository.startGame(infoSecondPlayer, pair._id, gameQuestions);

    return this.gameRepository.getGameById(pair._id);
  }
}
