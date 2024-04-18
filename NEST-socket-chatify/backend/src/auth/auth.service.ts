import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthDto } from '../../dto';
import { UserService } from '../user/user.service';
import { compare } from 'bcrypt';
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async comparePasswords(
    password: string,
    userPassword: string,
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      compare(password, userPassword, (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });
  }

  async signIn(authDto: AuthDto): Promise<{ access_token: string }> {
    try {
      const user: any = await this.userService.getUserByEmail(authDto.email);
      if (!user) throw new NotFoundException('User not found');

      const passwordsMatch = await this.comparePasswords(
        authDto.password,
        user.password,
      );
      if (!passwordsMatch) throw new UnauthorizedException();

      const payload = { name: user.userName, userId: user._id };
      const token = await this.jwtService.signAsync(payload);

      return {
        access_token: token,
      };
    } catch (error) {
      throw error;
    }
  }
}
