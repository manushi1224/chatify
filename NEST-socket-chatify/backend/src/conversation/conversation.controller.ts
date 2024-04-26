import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { ConversationDto } from '../../dto';
import { Conversation } from '../../schemas/conversation.schema';
import { ConversationService } from './conversation.service';

@Controller('conversation')
export class ConversationController {
  constructor(private convoService: ConversationService) {}

  // @Public()
  @Get('getAllConversationsByUserId/:userId')
  async getAllConversationsByUserId(
    @Param('userId') userId: string,
    @Res() res: any,
  ) {
    try {
      const allConversation =
        await this.convoService.getAllConversations(userId);
      return res.status(200).json(allConversation);
    } catch (error) {
      return res.status(error.status).json(error.message);
    }
  }

  // @Public()
  @Get('getConversationByConvoId/:convoId')
  async getConversationByConvoId(
    @Param('convoId') covoId: string,
    @Res() res: any,
  ): Promise<Conversation> {
    try {
      const conversation =
        await this.convoService.getConversationByConvoId(covoId);
      return res.status(200).json(conversation);
    } catch (error) {
      return res.status(error.status).json(error.message);
    }
  }

  // @Public()
  @Get('getConversationByMembers/:userId')
  async getConversationByMembers(
    @Param('userId') userId: string,
    @Res() res: any,
  ): Promise<any> {
    try {
      const conversation =
        await this.convoService.getConversationByMembers(userId);
      return res
        .status(200)
        .json({ conversation, message: 'Conversation Found!' });
    } catch (error) {
      return res.status(error.status).json(error.message);
    }
  }

  // @Public()
  @Post('createConversation')
  async createConversation(
    @Body() convo: ConversationDto,
    @Res() res: any,
  ): Promise<Conversation> {
    try {
      const createConversation =
        await this.convoService.createConversation(convo);
      return res.status(201).json({
        createConversation,
        message: 'Conversation Created Successfully!',
      });
    } catch (error) {
      return res.status(error.status).json(error.message);
    }
  }
}
