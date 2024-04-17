import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { UserDto } from 'dto/user.dto';
import { UserExistGuard } from './user.guard';
import { UserService } from './user.service';

@Controller('user')
class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(UserExistGuard)
  @Post('signUp')
  signUp(@Body() user: UserDto, @Res() res: any) {
    try {
      const newUser = this.userService.createNewUser(user);
      return res
        .status(201)
        .json({ message: 'New User Created Successfully!', newUser });
    } catch (error) {
      return res
        .status(error.status || 500)
        .json({ message: 'Failed to create new user' });
    }
  }
}

export default UserController;
