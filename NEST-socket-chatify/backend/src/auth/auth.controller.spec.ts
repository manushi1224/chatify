import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { User } from '../../schemas/user.schema';
import { UserService } from '../user/user.service';
import AuthController from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  let mockUser = {
    _id: '5f4e5f0f4a7f3b1d8c9f3d5e',
    username: 'test',
    email: 'test@gmail.com',
    password: 'test',
  };

  let mockService = {
    signIn: jest.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        UserService,
        JwtService,
        {
          provide: AuthService,
          useValue: mockService,
        },
        {
          provide: getModelToken(User.name),
          useValue: mockUser,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be accepted', () => {
    expect(authController).toBeDefined();
  });

  describe('signIn', () => {
    it('should return a new user', async () => {
      const newUser = {
        userName: 'test',
        email: 'test@gmail.com',
        password: 'test',
        imageUrl: 'test',
      };
      const result = await authController.signIn(newUser, {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnValue({ access_token: 'test' }),
      });
      expect(authService.signIn).toHaveBeenCalled();
      expect(result).toEqual({ access_token: 'test' });
    });
  });

  describe('getProfile', () => {
    it('should return a user profile', async () => {
      const result = await authController.getProfile(
        {
          status: jest.fn().mockReturnThis(),
          json: jest
            .fn()
            .mockReturnValue({ message: 'Profile', user: mockUser }),
        },
        { user: mockUser },
      );
      expect(result).toEqual({ message: 'Profile', user: mockUser });
    });
  });
});
