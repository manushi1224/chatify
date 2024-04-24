import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDto } from '../../dto';
import { User } from '../../schemas/user.schema';
const bcrypt = require('bcrypt');

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async createNewUser(user: UserDto): Promise<any> {
    const hashedPassword = await this.hashPassword(user.password);
    if (!hashedPassword) {
      return new BadRequestException('Failed to hash password');
    }

    try {
      const newUser = await this.userModel.create({
        userName: user.userName,
        email: user.email,
        password: hashedPassword,
        imageUrl: user.imageUrl,
      });
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

  async getUserById(userId: string): Promise<User> {
    try {
      const user = await this.userModel.findById(userId);
      return user;
    } catch (error) {
      return error;
    }
  }
}
