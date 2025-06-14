import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({required: true,unique: true,})
  email: string;

  @Prop({
    required: true,
    match: /^[6-9]\d{9}$/,
  })
  phone: string;

  @Prop({
    required: true,
    minlength: 6,
  })
  password: string;

  @Prop({
    default: 'user',
    enum: ['user', 'admin'],
  })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
