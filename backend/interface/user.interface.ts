import { Document } from 'mongoose';

export interface User extends Document {
  readonly userName: string;
  readonly email: string;
  readonly password: string;
  readonly imageUrl: string;
}
