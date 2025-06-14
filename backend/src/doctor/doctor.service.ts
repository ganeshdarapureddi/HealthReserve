import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Doctor, DoctorDocument } from './doctor.schema';
import { Model } from 'mongoose';

@Injectable()
export class DoctorService {
  constructor(
    @InjectModel(Doctor.name) private doctorModel: Model<DoctorDocument>,
  ) {}

  async findAll(): Promise<Doctor[]> {
    return this.doctorModel.find().exec();
  }
  async updateSlotStatus(doctorId: string, slotTime: string, status: boolean) {
    return this.doctorModel.updateOne(
      { _id: doctorId, 'slots.time': slotTime },
      { $set: { 'slots.$.booked': status } }
    );
  }
  

}
