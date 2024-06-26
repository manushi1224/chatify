import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import UserController from './user.controller';
import { UserExistGuard } from './user.guard';
import { UserService } from './user.service';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  let mockUser = {
    _id: '5f4e5f0f4a7f3b1d8c9f3d5e',
    username: 'test',
    email: 'test@gmail.com',
    password: 'test',
  };

  let mockService = {
    create: jest.fn(),
    getUser: jest.fn().mockResolvedValueOnce(mockUser),
    createNewUser: jest.fn().mockResolvedValueOnce(mockUser),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        UserExistGuard,
        {
          provide: UserService,
          useValue: mockService,
        },
        {
          provide: getModelToken('User'),
          useValue: {},
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be accepted', () => {
    expect(userController).toBeDefined();
  });

  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnValue(mockUser),
  };

  describe('createNewUser', () => {
    it('should return a new user', async () => {
      const newUser = {
        userName: 'test',
        email: 'test@gmail.com',
        password: 'test',
        imageUrl: 'test',
      };
      const result = await userController.signUp(newUser, mockRes);
      expect(userService.createNewUser).toHaveBeenCalledWith(newUser);
      expect(result).toEqual(mockUser);
    });
  });
});
