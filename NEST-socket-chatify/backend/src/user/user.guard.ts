import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../schemas/user.schema';

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
