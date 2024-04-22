import { Model } from 'mongoose';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { Message } from '../../schemas/message.schema';
import { Test } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';

describe('MessageController', () => {
  let messageController: MessageController;
  let messageService: MessageService;

  let mockMessage = {
    _id: '5f4e5f0f4a7f3b1d8c9f3d5e',
    senderId: '6620e7b9abe14b074b67e676',
    receiverId: '6620e7c89366f3880ac69339',
    conversationId: '5f4e5f0f4a7f3b1d8c9f3d5e',
    message: 'Hello',
    createdAt: '2020-09-01T15:00:00.000Z',
  };

  let mockService = {
    create: jest.fn(),
    createMessage: jest.fn(),
    getMessages: jest.fn().mockResolvedValueOnce([mockMessage]),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [MessageController],
      providers: [
        MessageService,
        {
          provide: getModelToken(Message.name),
          useValue: mockService,
        },
      ],
    }).compile();

    messageController = module.get<MessageController>(MessageController);
    messageService = module.get<MessageService>(MessageService);
  });

  it('should be accepted', () => {
    expect(messageController).toBeDefined();
  });

  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnValue(mockMessage),
  };

  describe('createMessage', () => {
    it('should return a new message', async () => {
      const newMessage = {
        senderId: '6620e7b9abe14b074b67e676',
        receiverId: '6620e7c89366f3880ac69339',
        conversationId: '5f4e5f0f4a7f3b1d8c9f3d5e',
        message: 'Hello',
      };
      const result = await messageController.createMessage(newMessage, mockRes);
      expect(result).toEqual(mockMessage);
    });
  });

  describe('getMessages', () => {
    it('should return all messages', async () => {
      const conversationId = '5f4e5f0f4a7f3b1d8c9f3d5e';
      const result = await messageController.getMessages(
        {
          status: jest.fn().mockReturnThis(),
          json: jest.fn().mockReturnValue([mockMessage]),
        },
        conversationId,
      );
      expect(result).toEqual([mockMessage]);
    });
  });
});
