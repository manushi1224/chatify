import { Model } from 'mongoose';
import { MessageService } from './message.service';
import { Message } from '../../schemas/message.schema';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';

describe('MessageService', () => {
  let service: MessageService;

  let mockMessage = {
    _id: '5f4e5f0f4a7f3b1d8c9f3d5e',
    senderId: '5f4e5f0f4a7f3b1d8c9f3d5e',
    recieverId: '5f4e5f0f4a7f3b1d8c9f3d5e',
    message: 'Hello',
    createdAt: '2020-09-01T15:00:00.000Z',
  };

  let mockService = {
    create: jest.fn(),
    createMessage: jest.fn(),
    getMessages: jest.fn(),
    deleteMessage: jest.fn(),
  };

  let model: Model<Message>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessageService,
        {
          provide: getModelToken(Message.name),
          useValue: mockService,
        },
      ],
    }).compile();

    service = module.get<MessageService>(MessageService);
    model = module.get<Model<Message>>(getModelToken('Message'));
  });

  describe('createMessage', () => {
    it('should create a new message', async () => {
      const newMessage = {
        _id: '5f4e5f0f4a7f3b1d8c9f3d5e',
        senderId: '5f4e5f0f4a7f3b1d8c9f3d5e',
        recieverId: '5f4e5f0f4a7f3b1d8c9f3d5e',
        message: 'Hello',
        createdAt: '2020-09-01T15:00:00.000Z',
      };
      jest.spyOn(model, 'create').mockResolvedValue(mockMessage as any);
      const result = await service.createMessage(newMessage);

      expect(result).toEqual(mockMessage);
    });
  });
});
