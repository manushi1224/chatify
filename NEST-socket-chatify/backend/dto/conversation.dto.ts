import { IsNotEmpty, IsString } from 'class-validator';

export class ConversationDto {
  @IsString()
  @IsNotEmpty()
  senderId: string;

  @IsString()
  @IsNotEmpty()
  recieverId: string;
}
