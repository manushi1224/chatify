import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { Public } from '../auth/auth.guard';
import { NotificationDto } from '../../dto';

@Controller('notification')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @Get('getNotification/:recieverId')
  async getNotification(
    @Param('recieverId') recieverId: string,
    @Res() res: any,
  ): Promise<NotificationDto> {
    try {
      const notification =
        await this.notificationService.getNotification(recieverId);
      return res.status(200).json(notification);
    } catch (error) {
      return res.status(error.status).json({ message: error.message });
    }
  }

  // @Public()
  @Post('createNotification')
  async createNotification(
    @Body() notification: NotificationDto,
    @Res() res: any,
  ): Promise<NotificationDto> {
    try {
      const newNotification =
        await this.notificationService.createNotification(notification);
      return res.status(201).json({
        newNotification,
        message: 'Notification Created Successfully!',
      });
    } catch (error) {
      console.log(error);
      return res.status(error.status).json({ message: error.message });
    }
  }

  @Public()
  @Delete('deleteNotification/:id')
  async deleteNotification(
    @Param('id') id: string,
    @Res() res: any,
  ): Promise<NotificationDto> {
    try {
      await this.notificationService.deleteNotification(id);
      return res
        .status(200)
        .json({ message: 'Notification Deleted Successfully!' });
    } catch (error) {
      return res.status(error.status).json({ message: error.message });
    }
  }
}
