import mongoose from 'mongoose';

export type AccountDataType = {
  login: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
};
export type UserType = {
  accountData: AccountDataType;
  emailConfirmation: EmailConfirmationType;
};
export type UserSchemaType = {
  _id: mongoose.Types.ObjectId;
  accountData: AccountDataType;
  emailConfirmation: EmailConfirmationType;
};

type EmailConfirmationType = {
  confirmationCode: string;
  expirationDate: Date;
  isConfirmed: boolean;
};
