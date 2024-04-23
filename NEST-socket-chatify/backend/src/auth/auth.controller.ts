import {
  Body,
  Controller,
  Get,
  HttpCode,
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
      return res.status(400).json({ error: error.message });
    }
  }

  @HttpCode(200)
  @Get('profile')
  async getProfile(@Res() res: any, @Request() req: any): Promise<any> {
    return res.status(200).json({ message: 'Profile', user: req.user });
  }
}

export default AuthController;
