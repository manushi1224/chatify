import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification } from 'schemas/notification.schema';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel('Notification') private notificationModel: Model<Notification>,
  ) {}

  async getNotification(recieverId: string): Promise<Notification[]> {
    try {
      const notification = await this.notificationModel.find({ recieverId });
      return notification;
    } catch (error) {
      return error;
    }
  }

  async createNotification(notification: any): Promise<Notification> {
    try {
      const newNotification = await new this.notificationModel(
        notification,
      ).save();
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
