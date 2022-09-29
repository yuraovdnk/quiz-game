import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ versionKey: false, _id: false })
class UserPlayer extends Document {
  @Prop({ type: Types.ObjectId })
  id: Types.ObjectId;
  @Prop({ type: String })
  login: string;
}
export const UserPlayerSchema = SchemaFactory.createForClass(UserPlayer);

@Schema({ versionKey: false, _id: false })
class Answers extends Document {
  @Prop({ type: String })
  questionId: string;

  @Prop({ type: String })
  answerStatus: string;

  @Prop({ type: Date })
  addedAt: Date;
}
export const AnswersSchema = SchemaFactory.createForClass(Answers);

@Schema({ versionKey: false, _id: false })
export class Player extends Document {
  @Prop({ type: [AnswersSchema], default: Array })
  answers: Answers;

  @Prop({ type: UserPlayerSchema })
  user: UserPlayer;

  @Prop({ type: Number, default: 0 })
  score: number;
}
export const PlayerSchema = SchemaFactory.createForClass(Player);

@Schema({ versionKey: false })
export class Game extends Document {
  @Prop({ type: PlayerSchema })
  firstPlayer: Player;

  @Prop({ type: PlayerSchema, default: null })
  secondPlayer: Player;

  @Prop({ type: String, default: 'PendingSecondPlayer' })
  status: string;

  @Prop({ type: Array })
  questions: Array<any>;

  @Prop({ type: Date, default: Date.now() })
  pairCreatedDate: Date;

  @Prop({ type: Date, default: null })
  startGameDate: Date;

  @Prop({ type: Date, default: null })
  finishGameDate: Date;
}
export const GameSchema = SchemaFactory.createForClass(Game);
