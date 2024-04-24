import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { Message } from '../../schemas/message.schema';
import { Public } from '../auth/auth.guard';
import { MessageService } from './message.service';
import { MessageDto } from 'dto/message.dto';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Public()
  @Post('createMessage')
  async createMessage(
    @Body() data: Message,
    @Res() res: any,
  ): Promise<MessageDto> {
    try {
      const newMessage = await this.messageService.createMessage(data);
      return res
        .status(201)
        .json({ message: 'Message Created Successfully!', newMessage });
    } catch (error) {
      return res.status(error.status).json(error.message);
    }
  }

  @Public()
  @Get('getMessages/:conversationId')
  async getMessages(
    @Res() res: any,
    @Param() { conversationId }: any,
  ): Promise<MessageDto[]> {
    try {
      const message = await this.messageService.getMessages(conversationId);
      return res.status(200).json(message);
    } catch (error) {
      return res.status(error.status).json(error.message);
    }
  }
}
