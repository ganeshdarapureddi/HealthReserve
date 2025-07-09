import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DoctorDocument = Doctor & Document;

@Schema()
export class Doctor {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  specialization: string;

  @Prop({ required: true })
  experience: number;

  @Prop({
    type: [
      {
        _id: false,
        time: { type: String, required: true },
        booked: { type: Boolean, default: false },
      },  
    ],
  })
  slots: { time: string; booked: boolean }[];
}

export const DoctorSchema = SchemaFactory.createForClass(Doctor);
