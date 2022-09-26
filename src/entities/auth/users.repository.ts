import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { UserSchemaType, UserType } from './types/user.types';

export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async registration(createUser: UserType) {
    return await this.userModel.create(createUser);
  }
  async findByLogin(login: string): Promise<UserSchemaType | null> {
    return this.userModel.findOne({ 'accountData.login': login });
  }
  async findById(id: mongoose.Types.ObjectId): Promise<UserSchemaType> {
    return this.userModel.findOne({ _id: id });
  }
}
