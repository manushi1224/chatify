import {
  CanActivate,
  ExecutionContext,
  Injectable
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserDto } from 'dto/user.dto';
import { Model } from 'mongoose';
import { User } from 'schemas/user.schema';
const bcrypt = require('bcrypt');

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async createNewUser(user: UserDto): Promise<any> {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    if (!hashedPassword) {
      return new Error('Failed to hash password');
    }

    const newUser = new this.userModel({
      userName: user.userName,
      email: user.email,
      password: hashedPassword,
      imageUrl: user.imageUrl,
    });

    try {
      await newUser.save();
      return newUser;
    } catch (error) {
      throw error;
    }
  }

  async getUserByEmail(email: string): Promise<User> {
    try {
      const user = await this.userModel.findOne({ email });
      return user;
    } catch (error) {
      return error;
    }
  }
}
