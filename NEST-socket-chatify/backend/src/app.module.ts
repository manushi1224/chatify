import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'schemas/user.schema';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConversationModule } from './conversation/conversation.module';
import { MessageModule } from './message/message.module';
import { NotificationModule } from './notification/notification.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    MongooseModule.forRoot(process.env.MONGODB_URL),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    AuthModule,
    UserModule,
    ConversationModule,
    MessageModule,
    NotificationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
