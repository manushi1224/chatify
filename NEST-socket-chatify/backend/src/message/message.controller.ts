import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { Message } from 'schemas/message.schema';
import { Public } from 'src/auth/auth.guard';
import { MessageService } from './message.service';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Public()
  @Post('createMessage')
  async createMessage(
    @Body() data: Message,
    @Res() res: any,
  ): Promise<Message> {
    try {
      const newMessage = await this.messageService.createMessage(data);
      return res.status(200).json(newMessage);
    } catch (error) {
      return res.status(error.status).json(error.message);
    }
  }

  @Public()
  @Get('getMessages')
  async getMessages(@Res() res: any): Promise<Message[]> {
    try {
      const message = await this.messageService.getMessages();
      return res.status(200).json(message);
    } catch (error) {
      return res.status(error.status).json(error.message);
    }
  }
}
