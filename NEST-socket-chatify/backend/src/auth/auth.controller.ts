import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthDto } from '../../dto';
import { AuthGaurd, Public } from './auth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(200)
  @Post('signin')
  async signIn(@Body() authDto: AuthDto, @Res() res: any): Promise<any> {
    try {
      const accessToken = await this.authService.signIn(authDto);
      return res.status(200).json(accessToken);
    } catch (error) {
      throw res.status(error.status).json({ error: error.message });
    }
  }

  @HttpCode(200)
  @Get('profile/:userId')
  async getProfile(@Res() res: any, @Param() { userId }: any): Promise<any> {
    try {
      const user = await this.authService.getProfile(userId);
      return res.status(200).json({ message: 'Profile', user });
    } catch (error) {
      throw res.status(error.status).json({ error: error.message });
    }
  }
}

export default AuthController;
