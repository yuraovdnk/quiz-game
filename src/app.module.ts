import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './entities/auth/auth.controller';
import { AuthService } from './entities/auth/auth.service';
import { UsersRepository } from './entities/auth/users.repository';
import { User, UserSchema } from './entities/auth/schemas/user.schema';
import { LocalStrategy } from './entities/auth/strategies/local-strategy';
import { JwtStrategy } from './entities/auth/strategies/jwt-strategy';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { GameController } from './entities/game/game.controller';
import { GameService } from './entities/game/application/game.service';
import { GameRepository } from './entities/game/infrastructure/game.repository';
import { Game, GameSchema } from './entities/game/schemas/game.schema';
import { Question, QuestionSchema } from './entities/game/schemas/question.schema';
import { CqrsModule } from '@nestjs/cqrs';
import { SendAnswerHandler } from './entities/game/application/use-cases/commands/send-answer.handler';
import { ConnectPlayerHandler } from './entities/game/application/use-cases/commands/connect-player.handler';
import { QueryGameRepository } from './entities/game/infrastructure/query-game.repository';
import { CurrentUserGameHandler } from './entities/game/application/use-cases/queries/current-user-game.handler';

const useCases = [SendAnswerHandler, ConnectPlayerHandler, CurrentUserGameHandler];
@Module({
  imports: [
    CqrsModule,
    MongooseModule.forRoot('mongodb://localhost:27017/youtube'),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Game.name, schema: GameSchema }]),
    MongooseModule.forFeature([{ name: Question.name, schema: QuestionSchema }]),
    PassportModule,
    JwtModule.register({}),
  ],
  controllers: [AuthController, GameController],
  providers: [
    AuthService,
    UsersRepository,
    QueryGameRepository,
    GameService,
    GameRepository,
    LocalStrategy,
    JwtStrategy,
    JwtService,
    ...useCases,
  ],
})
export class AppModule {}
