import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from 'dto/create-user-dto';
import { Model } from 'mongoose';
import { User } from 'schema/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private userModel: Model<User>) {}

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email });
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    const user = await this.userModel.find();
    return user;
  }

  async createUser(data: CreateUserDto): Promise<User> {
    try {
      const newUser = new this.userModel(data);
      const user = await newUser.save();
      return user;
    } catch (error) {
      console.log(error);
    }
  }
}

@Injectable()
export class UserExistGuard implements CanActivate {
  constructor(@InjectModel('User') private userModel: Model<User>) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const email = request.body.email;
    const user = await this.userModel.findOne({ email });
    return !!!user;
  }
}
