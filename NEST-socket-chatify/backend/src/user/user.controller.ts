import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserDto } from '../../dto';
import { UserExistGuard } from './user.guard';
import { UserService } from './user.service';
import { Public } from '../auth/auth.guard';

@Controller('user')
class UserController {
  constructor(private userService: UserService) {}

  @Public()
  @UseGuards(UserExistGuard)
  @Post('signUp')
  async signUp(@Body() user: UserDto, @Res() res: any): Promise<UserDto> {
    try {
      const { newUser, token } = await this.userService.createNewUser(user);
      return res.status(201).json({
        message: 'User Created Successfully!',
        newUser: newUser,
        token: token,
      });
    } catch (error) {
      return res
        .status(error.status || 500)
        .json({ message: 'Failed to create new user' });
    }
  }

  @Patch('updateProfile/:uid')
  async updateProfile(
    @Body() user: any,
    @Param('uid') uid: string,
    @Res() res: any,
  ): Promise<any> {
    try {
      const updatedUser = await this.userService.updateUserProfile(user, uid);
      return res
        .status(200)
        .json({ message: 'User Profile Updated Successfully!', updatedUser });
    } catch (error) {
      return res
        .status(error.status || 500)
        .json({ message: 'Failed to update user profile' });
    }
  }
}

export default UserController;
