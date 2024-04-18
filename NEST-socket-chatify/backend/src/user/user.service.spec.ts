import { BadRequestException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { User } from '../../schemas/user.schema';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let model: Model<User>;

  const mockUser = {
    _id: '5f4e5f0f4a7f3b1d8c9f3d5e',
    userName: 'username',
    email: 'test1@gmail.com',
    password: 'password',
    imageUrl: 'avatar',
  };

  const mockUserService = {
    find: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
    findOne: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    model = module.get<Model<User>>(getModelToken('User'));
  });

  describe('createNewUser', () => {
    const newUser = {
      userName: 'username',
      email: 'test1@gmail.com',
      password: 'password',
      imageUrl: 'avatar',
    };

    it('should return a new user', async () => {
      jest.spyOn(service, 'hashPassword').mockResolvedValue('password');
      jest.spyOn(model, 'create').mockResolvedValue(mockUser as any);

      const result = await service.createNewUser(newUser as any);
      expect(result).toEqual(mockUser);

      expect(model.create).toHaveBeenCalledWith(newUser);
    });

    it('should throw an error if password hashing fails', async () => {
      jest
        .spyOn(service, 'hashPassword')
        .mockRejectedValue(new BadRequestException('Failed to hash password'));

      expect(service.createNewUser(newUser as any)).rejects.toThrow(
        BadRequestException,
      );
    });

    describe('getUserByEmail', () => {
      it('should return a user', async () => {
        jest.spyOn(model, 'findOne').mockResolvedValue(mockUser as any);

        const result = await service.getUserByEmail(mockUser.email);
        expect(result).toEqual(mockUser);
      });
    });
  });
});
