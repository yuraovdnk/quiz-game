import mongoose, { Model } from 'mongoose';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GameRepository } from '../../../infrastructure/game.repository';
import { ForbiddenException } from '@nestjs/common';
import { UsersRepository } from '../../../../auth/users.repository';
import { QueryGameRepository } from '../../../infrastructure/query-game.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Game } from '../../../schemas/game.schema';

export class ConnectPlayerCommand {
  constructor(public readonly userId: mongoose.Types.ObjectId) {}
}

@CommandHandler(ConnectPlayerCommand)
export class ConnectPlayerHandler implements ICommandHandler<ConnectPlayerCommand> {
  constructor(
    private gameRepository: GameRepository,
    @InjectModel(Game.name) protected gameModel: Model<Game>,
    private usersRepository: UsersRepository,
    private queryGameRepository: QueryGameRepository,
  ) {}

  async execute(command: ConnectPlayerCommand): Promise<Game> {
    try {
      const { userId } = command;

      const isParticipleUser = await this.queryGameRepository.getCurrentUserGame(userId);
      if (isParticipleUser) {
        throw new ForbiddenException();
      }

      const user = await this.usersRepository.findById(userId);
      const pair = await this.queryGameRepository.getFreeGame();

      if (!pair) {
        const game = new this.gameModel({
          firstPlayer: {
            user: {
              id: user._id,
              login: user.accountData.login,
            },
            secondPlayer: null,
          },
        });
        await game.save();
        return game;

        //return await this.gameRepository.createGame(infoFirstPlayer);
      }

      const infoSecondPlayer = {
        id: user._id,
        login: user.accountData.login,
      };

      const gameQuestions = await this.queryGameRepository.getQuestions();

      const mappedQuestions = gameQuestions.map(({ answer, ...rest }) => {
        return rest;
      });

      await this.gameRepository.startGame(infoSecondPlayer, pair._id, mappedQuestions);

      return this.queryGameRepository.getGameById(pair._id);
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}
