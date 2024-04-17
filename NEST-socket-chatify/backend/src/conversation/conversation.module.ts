import { Module } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { ConversationController } from './conversation.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ConversationSchema } from 'schemas/conversation.schema';
import { UserSchema } from 'schemas/user.schema';

@Module({
  providers: [ConversationService],
  controllers: [ConversationController],
  imports: [
    MongooseModule.forFeature([
      { name: 'Conversation', schema: ConversationSchema },
      { name: 'User', schema: UserSchema },
    ]),
  ],
})
export class ConversationModule {}
