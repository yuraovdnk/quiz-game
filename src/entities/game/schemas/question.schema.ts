import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ versionKey: false, collection: 'quiz-game-questions' })
export class Question extends Document {
  @Prop({ type: String })
  body: string;

  @Prop({ type: String })
  status: string;

  @Prop({ type: String })
  answer: string;
}
export const QuestionSchema = SchemaFactory.createForClass(Question);
