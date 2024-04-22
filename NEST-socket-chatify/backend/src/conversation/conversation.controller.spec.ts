import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { Conversation } from '../../schemas/conversation.schema';
import { ConversationController } from './conversation.controller';
import { ConversationService } from './conversation.service';
import { UserService } from '../user/user.service';
import { User } from '../../schemas/user.schema';

describe('ConversationController', () => {
  let conversationController: ConversationController;
  let conversationService: ConversationService;

  let mockConversation = {
    _id: '5f4e5f0f4a7f3b1d8c9f3d5e',
    members: ['6620e7b9abe14b074b67e676', '6620e7c89366f3880ac69339'],
    createdAt: '2020-09-01T15:00:00.000Z',
  };

  let mockUser = {
    _id: '6620e7b9abe14b074b67e676',
    username: 'User1',
    email: 'user@gmail.com',
    password: 'passsword',
  };

  let mockUserService = {
    create: jest.fn(),
    find: jest.fn().mockResolvedValueOnce(mockUser),
    findById: jest.fn().mockResolvedValueOnce(mockUser),
  };

  let mockService = {
    create: jest.fn(),
    createConversation: jest.fn(),
    getAllConversations: jest.fn(),
    getConversationByConvoId: jest.fn().mockResolvedValueOnce(mockConversation),
    getConversationByMembers: jest
      .fn()
      .mockResolvedValueOnce([mockConversation]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConversationController],
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

    conversationController = module.get<ConversationController>(
      ConversationController,
    );
    conversationService = module.get<ConversationService>(ConversationService);
  });

  it('should be accepted', () => {
    expect(conversationController).toBeDefined();
  });

  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnValue(mockConversation),
  };

  describe('createBook', () => {
    it('should create a new book', async () => {
      const newConversation = {
        senderId: '6620e7b9abe14b074b67e676',
        recieverId: '6620e7c89366f3880ac69339',
      };

      mockService.create = jest.fn().mockResolvedValueOnce(mockConversation);

      const result = await conversationController.createConversation(
        newConversation,
        mockRes,
      );

      expect(mockService.create).toHaveBeenCalled();
      expect(result).toEqual(mockConversation);
    });
  });

  describe('getAllConversationsByUserId', () => {
    beforeEach(() => {
      jest.clearAllMocks(); // Reset all mock calls
    });
    mockService.getAllConversations = jest
      .fn()
      .mockResolvedValueOnce([mockConversation]);

    it('should return all conversations by userId', async () => {
      const result = await conversationController.getAllConversationsByUserId(
        mockUser._id,
        mockRes,
      );

      expect(result).toEqual(mockConversation);
    });
  });

  describe('getConversationByConvoId', () => {
    it('should return a conversation by convoId', async () => {
      const result = await conversationController.getConversationByConvoId(
        mockConversation._id,
        mockRes,
      );

      expect(result).toEqual(mockConversation);
    });
  });

  describe('getConversationByMembers', () => {
    it('should return a conversation by members', async () => {
      const result = await conversationController.getConversationByMembers(
        mockUser._id,
        mockRes,
      );

      expect(result).toEqual(mockConversation);
    });
  });
});
