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
    required: false,
    match: /^[6-9]\d{9}$/,
  })
  phone: string;

  @Prop({
    type: String,
    default: null,
    required: false,
    minlength: 6,
  })
  password: string | null;

  @Prop({
    default: 'user',
    enum: ['user', 'admin'],
  })
  role: string; 

  @Prop({
    default:"custom",
    enum:["custom","google"],
  })
  provider:string
}

export const UserSchema = SchemaFactory.createForClass(User);
