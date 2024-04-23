import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConversationSchema } from '../../schemas/conversation.schema';
import { UserSchema } from '../../schemas/user.schema';
import { UserModule } from '../user/user.module';
import { ConversationController } from './conversation.controller';
import { ConversationService } from './conversation.service';

@Module({
  providers: [ConversationService],
  controllers: [ConversationController],
  imports: [
    UserModule,
    MongooseModule.forFeature([
      { name: 'Conversation', schema: ConversationSchema },
      { name: 'User', schema: UserSchema },
    ]),
  ],
})
export class ConversationModule {}
