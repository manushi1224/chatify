import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Message {
  @Prop()
  senderId: string;

  @Prop()
  receiverId: string;

  @Prop()
  conversationId: string;

  @Prop()
  message: string;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
