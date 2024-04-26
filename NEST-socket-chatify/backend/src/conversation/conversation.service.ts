import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConversationDto } from 'dto/conversation.dto';
import mongoose, { Model } from 'mongoose';
import { Conversation } from '../../schemas/conversation.schema';
import { User } from '../../schemas/user.schema';

@Injectable()
export class ConversationService {
  constructor(
    @InjectModel('Conversation')
    private readonly conversationModel: Model<Conversation>,
    @InjectModel('User')
    private readonly userModel: Model<User>,
  ) {}

  async createConversation(convo: ConversationDto): Promise<Conversation> {
    const existingConvo = await this.conversationModel.findOne({
      members: { $all: [convo.senderId, convo.recieverId] },
    });
    if (existingConvo) {
      throw new ConflictException('Conversation already exists');
    }

    const newConvo = await this.conversationModel.create({
      members: [convo.senderId, convo.recieverId],
    });
    return newConvo;
  }

  async getAllConversations(userId: string): Promise<Conversation[]> {
    const isValidObjectId = mongoose.isValidObjectId(userId);
    if (!isValidObjectId) {
      throw new NotFoundException('Invalid userId');
    }

    try {
      const allConvo = await this.conversationModel.find({
        members: { $in: [userId] },
      });
      return allConvo;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async getConversationByConvoId(convoId: string): Promise<Conversation> {
    try {
      const conversation = await this.conversationModel.findById(convoId);
      return conversation;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async getConversationByMembers(userId: string): Promise<Conversation | any> {
    const isValidObjectId = mongoose.isValidObjectId(userId);
    if (!isValidObjectId) {
      throw new NotFoundException('Invalid userId');
    }
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
      throw new NotFoundException(error.message);
    }
  }
}
