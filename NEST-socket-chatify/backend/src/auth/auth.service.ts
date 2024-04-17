import { Injectable, NotFoundException } from '@nestjs/common';
import { AuthDto } from 'dto';
import { User } from 'schemas/user.schema';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}
  async signIn(authDto: AuthDto): Promise<{ access_token: string }> {
    try {
      const user = await this.userService.getUserByEmail(authDto.email);
      if (!user) throw new NotFoundException('User not found');

      const isPasswordMatch = await bcrypt.compare(
        authDto.password,
        user.password,
      );
      if (!isPasswordMatch) throw new NotFoundException('Invalid password');

      const payload = { sub: user.userName };
      const token = await this.jwtService.signAsync(payload);

      return {
        access_token: token,
      };
    } catch (error) {
      return error;
    }
  }
}
