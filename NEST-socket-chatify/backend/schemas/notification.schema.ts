import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Notification {
  @Prop()
  senderId: string;

  @Prop()
  recieverId: string;

  @Prop()
  text: string;

  @Prop()
  userName: string;

  @Prop()
  type: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
