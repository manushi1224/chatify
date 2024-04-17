import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageSchema } from 'schemas/message.schema';

@Module({
  providers: [MessageService],
  controllers: [MessageController],
  imports: [
    MongooseModule.forFeature([{ name: 'Message', schema: MessageSchema }]),
  ],
})
export class MessageModule {}
