import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Conversation {
  @Prop()
  members: string[];
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
