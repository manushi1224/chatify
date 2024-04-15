import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class User {
  @Prop()
  userName: string;
  @Prop()
  email: string;
  @Prop()
  password: string;
  @Prop()
  imageUrl: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
