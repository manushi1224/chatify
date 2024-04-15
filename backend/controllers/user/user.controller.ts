import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from 'dto/create-user-dto';
import { UserExistGuard, UserService } from 'service/user/user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUsers(@Res() response: any) {
    try {
      const userData = await this.userService.getAllUsers();
      return response.status(200).json({
        success: true,
        data: userData,
      });
    } catch (error) {
      return response.status(error.status).json(error.response);
    }
  }

  @Get('/:emailId')
  async getUserById(@Res() response: any, @Param('emailId') emailId: string) {
    try {
      const userData = await this.userService.getUserByEmail(emailId);
      return response.status(200).json({
        success: true,
        data: userData,
      });
    } catch (error) {
      return response.status(error.status).json(error.response);
    }
  }

  @UseGuards(UserExistGuard)
  @Post()
  async createUser(@Res() response: any, @Body() createUserDto: CreateUserDto) {
    try {
      const userData = await this.userService.createUser(createUserDto);
      return response.status(201).json({
        success: true,
        message: 'User created',
      });
    } catch (error) {
      return response.status(error.status).json(error.response);
    }
  }
}
