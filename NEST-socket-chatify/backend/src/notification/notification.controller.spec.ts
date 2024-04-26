import { Test } from '@nestjs/testing';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { getModelToken } from '@nestjs/mongoose';
import { Notification } from '../../schemas/notification.schema';

describe('NotificationController', () => {
  let notificationController: NotificationController;
  let notificationService: NotificationService;

  let mockNotification = {
    _id: '5f4e5f0f4a7f3b1d8c9f3d5e',
    senderId: '6620e7b9abe14b074b67e676',
    recieverId: '6620e7c89366f3880ac69339',
    type: 'message',
    text: 'Hello',
    createdAt: '2020-09-01T15:00:00.000Z',
  };

  let mockService = {
    create: jest.fn(),
    getNotifications: jest.fn().mockResolvedValueOnce([mockNotification]),
    createNotification: jest.fn().mockResolvedValueOnce(mockNotification),
    deleteNotification: jest.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [NotificationController],
      providers: [
        NotificationService,
        {
          provide: NotificationService,
          useValue: mockService,
        },
      ],
    }).compile();

    notificationController = module.get<NotificationController>(
      NotificationController,
    );
    notificationService = module.get<NotificationService>(NotificationService);
  });

  it('should be accepted', () => {
    expect(notificationController).toBeDefined();
  });

  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnValue(mockNotification),
  };

  describe('getNotification', () => {
    it('should return a notification by user id', async () => {
      const result = await notificationController.getNotification(
        '6620e7c89366f3880ac69339',
        {
          status: jest.fn().mockReturnThis(),
          json: jest.fn().mockReturnValue([mockNotification]),
        },
      );

      expect(result).toEqual([mockNotification]);
    });
  });

  describe('createNotification', () => {
    it('should return a new notification', async () => {
      const newNotification = {
        senderId: '6620e7b9abe14b074b67e676',
        recieverId: '6620e7c89366f3880ac69339',
        userName: 'test',
        text: 'Hello',
        type: 'message',
        createdAt: '2020-09-01T15:00:00.000Z',
      };

      const result = await notificationController.createNotification(
        newNotification,
        mockRes,
      );

      expect(notificationService.createNotification).toHaveBeenCalledWith(
        newNotification,
      );
      expect(result).toEqual(mockNotification);
    });
  });

  describe('deleteNotification', () => {
    it('should delete a notification', async () => {
      const result = await notificationController.deleteNotification(
        '5f4e5f0f4a7f3b1d8c9f3d5e',
        {
          status: jest.fn().mockReturnThis(),
          json: jest
            .fn()
            .mockReturnValue({ message: 'Notification deleted successfully' }),
        },
      );

      expect(notificationService.deleteNotification).toHaveBeenCalled();
      expect(result).toEqual({
        message: 'Notification deleted successfully',
      });
    });
  });
});
