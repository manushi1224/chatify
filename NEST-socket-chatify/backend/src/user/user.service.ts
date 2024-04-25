import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDto } from '../../dto';
import { User } from '../../schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
const bcrypt = require('bcrypt');

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

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
      const payload = { name: user.userName, userId: newUser._id };
      const token = await this.jwtService.signAsync(payload);
      return { newUser, token };
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

  async updateUserProfile(user: any, uid: string): Promise<User> {
    const { userName, imageUrl } = user;
    try {
      const user = await this.userModel.findById(uid);
      user.userName = userName || user.userName;
      user.imageUrl = imageUrl || user.imageUrl;
      await user.save();
      return user;
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }
}
