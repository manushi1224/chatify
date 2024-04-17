import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthDto } from 'dto';
import { UserService } from 'src/user/user.service';
const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}
  async signIn(authDto: AuthDto): Promise<{ access_token: string }> {
    try {
      const user: any = await this.userService.getUserByEmail(authDto.email);
      if (!user) throw new NotFoundException('User not found');

      const isPasswordMatch = await bcrypt.compare(
        authDto.password,
        user.password,
      );
      if (!isPasswordMatch) throw new NotFoundException('Invalid password');

      const payload = { name: user.userName, userId: user._id };
      const token = await this.jwtService.signAsync(payload);

      return {
        access_token: token,
      };
    } catch (error) {
      return error;
    }
  }
}
