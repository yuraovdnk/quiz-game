import { Injectable } from '@nestjs/common';
import { GameRepository } from '../infrastructure/game.repository';
import { UsersRepository } from '../../auth/users.repository';

@Injectable()
export class GameService {
  constructor(protected gameRepository: GameRepository, protected usersRepository: UsersRepository) {}
}
