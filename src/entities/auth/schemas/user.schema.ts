import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';
@Schema({ versionKey: false })
export class EmailConfirmation {
  @Prop({
    type: String,
    required: true,
  })
  confirmationCode: string;
  @Prop({
    type: Date,
    required: true,
  })
  expirationDate: Date;

  @Prop({
    type: Boolean,
    required: true,
  })
  isConfirmed: boolean;
}

@Schema({ versionKey: false })
export class AccountData {
  @Prop({
    type: String,
    required: true,
  })
  login: string;

  @Prop({
    type: String,
    required: true,
  })
  email: string;

  @Prop({
    type: String,
    required: true,
  })
  passwordHash: string;

  @Prop({
    type: Date,
    default: Date.now(),
  })
  createdAt: Date;
}
export const AccountDataSchema = SchemaFactory.createForClass(AccountData);
export const EmailConfirmationSchema = SchemaFactory.createForClass(EmailConfirmation);

@Schema({ versionKey: false })
export class User extends Document {
  @Prop({ type: AccountDataSchema })
  accountData: string;

  @Prop({ type: EmailConfirmationSchema })
  emailConfirmation: EmailConfirmation;
}

export const UserSchema = SchemaFactory.createForClass(User);
