import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from 'schemas/message.schema';

@Injectable()
export class MessageService {
  constructor(@InjectModel('Message') private messageModel: Model<Message>) {}

  async createMessage(data: any): Promise<Message> {
    try {
      const newMessage = await new this.messageModel(data).save();
      return newMessage;
    } catch (error) {
      return error;
    }
  }

  async getMessages(): Promise<Message[]> {
    try {
      const allMessages = await this.messageModel.find();
      return allMessages;
    } catch (error) {
      return error;
    }
  }
}
