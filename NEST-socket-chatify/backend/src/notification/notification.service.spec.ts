import { NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import mongoose, { Model } from 'mongoose';
import { Notification } from '../../schemas/notification.schema';
import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;

  const mockNotification = {
    _id: '1',
    senderId: 'sender123',
    recieverId: '6602a17beab77ad87bf2ef74',
    text: 'You have a new message!',
    userName: 'User 1',
    type: 'request',
    createdAt: '2024-04-18T05:47:33.680+00:00',
  };

  const mockNotificationService = {
    find: jest.fn(),
    create: jest.fn(),
    findByIdAndDelete: jest.fn(),
    getNotification: jest.fn(),
  };

  let model: Model<Notification>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationService,
        {
          provide: getModelToken(Notification.name),
          useValue: mockNotificationService,
        },
      ],
    }).compile();

    service = module.get<NotificationService>(NotificationService);
    model = module.get<Model<Notification>>(getModelToken('Notification'));
  });

  describe('getNotification', () => {
    it('should return an array of notifications', async () => {
      jest.spyOn(model, 'find').mockResolvedValue([mockNotification as any]);

      const result = await service.getNotification(mockNotification.recieverId);
      expect(model.find).toHaveBeenCalledWith({
        recieverId: mockNotification.recieverId,
      });
      expect(result).toEqual([mockNotification]);
    });

    it('should throw an error if recieverId is invalid', async () => {
      const inValidId = 'invalidId';
      const invalidObjectIdMock = jest
        .spyOn(mongoose, 'isValidObjectId')
        .mockReturnValue(false);

      await expect(service.getNotification(inValidId)).rejects.toThrow(
        NotFoundException,
      );
      expect(invalidObjectIdMock).toHaveBeenCalledWith(inValidId);
      invalidObjectIdMock.mockRestore();
    });

    it('should throw an error if no notification is found', async () => {
      jest.spyOn(model, 'find').mockResolvedValue(null);

      await expect(
        service.getNotification(mockNotification.recieverId),
      ).rejects.toThrow(NotFoundException);

      expect(model.find).toHaveBeenCalledWith({
        recieverId: mockNotification.recieverId,
      });
    });
  });

  describe('deleteNotification', () => {
    it('should delete a notification', async () => {
      jest.spyOn(model, 'findByIdAndDelete').mockResolvedValue(null);

      const result = await service.deleteNotification(mockNotification._id);
      expect(model.findByIdAndDelete).toHaveBeenCalledWith(
        mockNotification._id,
      );
      expect(result).toBeUndefined();
    });
  });

  describe('createNotification', () => {
    it('should create a notification', async () => {
      const newNotification = {
        senderId: 'sender123',
        recieverId: '6602a17beab77ad87bf2ef74',
        text: 'You have a new message!',
        userName: 'User 1',
        type: 'request',
        createdAt: '2024-04-18T05:47:33.680+00:00',
      };

      jest
        .spyOn(model, 'create')
        .mockImplementationOnce(() => Promise.resolve(mockNotification as any));

      const result = await service.createNotification(newNotification);

      expect(result).toEqual(mockNotification);
    });
  });
});
