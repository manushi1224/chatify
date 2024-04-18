import { NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import mongoose, { Model } from 'mongoose';
import { Conversation } from '../../schemas/conversation.schema';
import { User } from '../../schemas/user.schema';
import { UserService } from '../user/user.service';
import { ConversationService } from './conversation.service';

describe('ConversationService', () => {
  const mockConversation = {
    _id: '5f4e5f0f4a7f3b1d8c9f3d5e',
    members: ['6620e7b9abe14b074b67e676', '6620e7c89366f3880ac69339'],
    createdAt: '2020-09-01T15:00:00.000Z',
  };

  const mockUser = {
    _id: '6620e7b9abe14b074b67e676',
    username: 'User1',
    email: 'user1@gmail.com',
    password: 'password',
  };

  let service: ConversationService;
  let userService: UserService;

  let mockService = {
    find: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
    getAllConversations: jest.fn(),
    getConversations: jest.fn(),
    deleteConversation: jest.fn(),
  };

  let mockUserService = {
    find: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
  };

  let model: Model<Conversation>;
  let userModel: Model<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConversationService,
        UserService,
        {
          provide: getModelToken(Conversation.name),
          useValue: mockService,
        },
        {
          provide: getModelToken(User.name),
          useValue: mockUserService,
        },
      ],
    }).compile();

    service = module.get<ConversationService>(ConversationService);
    userService = module.get<UserService>(UserService);
    model = module.get<Model<Conversation>>(getModelToken('Conversation'));
    userModel = module.get<Model<User>>(getModelToken('User'));
  });

  describe('createConversation', () => {
    it('should create a new conversation', async () => {
      const newConversation = {
        senderId: '6620e7b9abe14b074b67e676',
        recieverId: '6620e7c89366f3880ac69339',
      };

      jest.spyOn(model, 'create').mockResolvedValue(mockConversation as any);

      const result = await service.createConversation(newConversation);
      expect(result).toEqual(mockConversation);
    });
  });

  describe('getAllConversations', () => {
    it('should return all conversations of a user', async () => {
      const invalidObjectId = jest
        .spyOn(model, 'find')
        .mockResolvedValue([mockConversation as any]);

      const result = await service.getAllConversations(
        '6620e7b9abe14b074b67e676',
      );

      expect(result).toEqual([mockConversation]);
      invalidObjectId.mockRestore();
    });

    it('should throw an error if userId is invalid', async () => {
      const userId = 'invalidId';
      const invalidObjectIdMock = jest
        .spyOn(mongoose, 'isValidObjectId')
        .mockReturnValue(false);

      await expect(service.getAllConversations(userId)).rejects.toThrow(
        NotFoundException,
      );
      invalidObjectIdMock.mockRestore();
    });
  });

  describe('getConversationByConvoId', () => {
    it('should return a conversation by its id', async () => {
      const mockSpy = jest
        .spyOn(model, 'findById')
        .mockResolvedValue(mockConversation as any);
      const result = await service.getConversationByConvoId(
        mockConversation._id,
      );
      expect(result).toEqual(mockConversation);
      mockSpy.mockRestore();
    });
  });

  describe('getConversationByMembers', () => {
    it('should throw an error if userId is invalid', async () => {
      const userId = 'invalidId';
      const invalidObjectIdMock = jest
        .spyOn(mongoose, 'isValidObjectId')
        .mockReturnValue(false);
      await expect(service.getAllConversations(userId)).rejects.toThrow(
        NotFoundException,
      );

      invalidObjectIdMock.mockRestore();
    });

    it('should return all conversations', async () => {
      jest.spyOn(model, 'find').mockResolvedValue([mockConversation as any]);
      jest.spyOn(userModel, 'find').mockResolvedValue([mockUser as any]);

      const result = await service.getConversationByMembers(mockUser._id);
      expect(Array.isArray(result.newUsers)).toBe(true);
      expect(Array.isArray(result.pastUsers)).toBe(true);
    });
  });
});
