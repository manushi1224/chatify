import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { User } from '../../schemas/user.schema';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  let mockAuth = {
    _id: '5f4e5f0f4a7f3b1d8c9f3d5e',
    password: '$2b$10$3JZ5lR5G1oB1v7p3Zs7l7e3Qp5D0Z8R6b2V4Z2V5Z2V5Z2V5Z2V5Z',
    email: 'test@gmail.com',
  };

  let mockService = {
    find: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
    login: jest.fn(),
    findOne: jest.fn(),
  };
  let token = 'token';

  let jwtService: JwtService;

  let model: Model<User>;
  let userModel: Model<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: mockService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    model = module.get<Model<User>>(getModelToken('User'));
    userModel = module.get<Model<User>>(getModelToken('User'));
  });

  describe('signIn', () => {
    const signInDto = {
      email: 'test1@gmail.com',
      password: 'password',
    };

    it('should return an access token', async () => {
      const jestValid = jest
        .spyOn(model, 'findOne')
        .mockResolvedValue(mockAuth as any);

      jest.spyOn(service, 'comparePasswords').mockResolvedValue(true);
      jest
        .spyOn(jwtService, 'signAsync')
        .mockReturnValue(Promise.resolve(token));

      const result = await service.signIn(signInDto);
      expect(result).toEqual({ access_token: token });
      jestValid.mockRestore();
    });

    it('should throw an error if user not found', async () => {
      const jestValid = jest
        .spyOn(userModel, 'findOne')
        .mockResolvedValue(null);

      await expect(service.signIn(signInDto)).rejects.toThrow(
        NotFoundException,
      );
      jestValid.mockRestore();
    });

    it('should throw an error if passwords do not match', async () => {
      jest.spyOn(userModel, 'findOne').mockResolvedValue(mockAuth as any);
      jest.spyOn(service, 'comparePasswords').mockResolvedValue(false);

      await expect(service.signIn(signInDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
