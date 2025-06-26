import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Doctor } from 'src/doctor/doctor.schema';
import { User } from 'src/user/user.schema';

export type AppointmentDocument = Appointment & Document;

@Schema()
export class Appointment {
  @Prop({ required: true })
  patientName: string;

  @Prop({ type: Types.ObjectId, ref: 'Doctor',required:true })
  doctor: Doctor

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: User
  
  @Prop({required:true})
  date:string

  @Prop({ required: true })
  slot: string;
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);
