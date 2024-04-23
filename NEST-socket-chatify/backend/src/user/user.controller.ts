import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
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
      const newUser = await this.userService.createNewUser(user);
      return res
        .status(201)
        .json({ message: 'User Created Successfully!', newUser });
    } catch (error) {
      return res
        .status(error.status || 500)
        .json({ message: 'Failed to create new user' });
    }
  }
}

export default UserController;
