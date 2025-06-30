import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Doctor } from 'src/doctor/doctor.schema';
import { User } from 'src/user/user.schema';
import { AppointmentStatus } from './enums/appointmentStatus';

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

  @Prop({
    type: String,
    enum: AppointmentStatus,
    default: AppointmentStatus.Pending,
    required: true,
  })
  status: AppointmentStatus;
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);
