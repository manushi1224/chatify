import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from '../../schemas/message.schema';

@Injectable()
export class MessageService {
  constructor(@InjectModel('Message') private messageModel: Model<Message>) {}

  async createMessage(data: any): Promise<Message> {
    try {
      const newMessage = await this.messageModel.create(data);
      return newMessage;
    } catch (error) {
      throw new NotFoundException(error);
    }
  }

  async getMessages(conversationId: string): Promise<Message[]> {
    try {
      console.log(conversationId, 'conversationId');
      const allMessages = await this.messageModel.find({
        conversationId,
      });
      return allMessages;
    } catch (error) {
      throw new NotFoundException(error);
    }
  }
}
