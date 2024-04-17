import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConversationDto } from 'dto/conversation.dto';
import { Model } from 'mongoose';
import { Conversation } from 'schemas/conversation.schema';
import { User } from 'schemas/user.schema';

@Injectable()
export class ConversationService {
  constructor(
    @InjectModel('Conversation')
    private readonly conversationModel: Model<Conversation>,
    @InjectModel('User')
    private readonly userModel: Model<User>,
  ) {}

  async createConversation(convo: ConversationDto): Promise<Conversation> {
    try {
      const newConvo = await new this.conversationModel({
        members: [convo.senderId, convo.recieverId],
      }).save();
      return newConvo;
    } catch (error) {
      return error;
    }
  }

  async getAllConversations(userId: string): Promise<Conversation[]> {
    try {
      console.log(userId);
      const allConvo = await this.conversationModel.find({
        members: { $in: [userId] },
      });
      return allConvo;
    } catch (error) {
      return error;
    }
  }

  async getConversationByConvoId(convoId: string): Promise<Conversation> {
    try {
      const conversation = await this.conversationModel.findById(convoId);
      return conversation;
    } catch (error) {
      return error;
    }
  }

  async getConversationByMembers(userId: string): Promise<any> {
    try {
      const conversations = await this.conversationModel.find();
      let pastUsers = [];
      let temp = [];
      conversations.forEach((conversation) => {
        if (conversation.members.includes(userId)) {
          temp = conversation.members.filter((member) => member !== userId);
          pastUsers.push(temp[0]);
        }
      });

      const allUsers = await this.userModel.find();
      let newUsers = [];
      if (pastUsers.length === 0) {
        newUsers = allUsers.filter((user) => user._id.toString() !== userId);
      }

      newUsers = allUsers.filter(
        (user) =>
          !pastUsers.includes(user._id.toString()) &&
          user._id.toString() !== userId,
      );

      return { pastUsers, newUsers };
    } catch (error) {
      return error;
    }
  }
}
