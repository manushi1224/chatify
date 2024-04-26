import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Notification } from '../../schemas/notification.schema';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel('Notification') private notificationModel: Model<Notification>,
  ) {}

  async getNotification(recieverId: string): Promise<Notification[]> {
    const validId = mongoose.isValidObjectId(recieverId);
    if (!validId) {
      throw new NotFoundException('Invalid recieverId');
    }
    const notification = await this.notificationModel.find({
      recieverId,
    });
    if (!notification) {
      throw new NotFoundException('No notification found');
    }
    return notification;
  }

  async createNotification(notification: any): Promise<Notification> {
    try {
      const newNotification = await this.notificationModel.create(notification);
      return newNotification;
    } catch (error) {
      return error;
    }
  }

  async deleteNotification(id: string): Promise<Notification> {
    try {
      await this.notificationModel.findByIdAndDelete(id);
      return;
    } catch (error) {
      return error;
    }
  }
}
