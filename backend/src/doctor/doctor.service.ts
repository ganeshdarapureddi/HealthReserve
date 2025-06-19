import { Injectable, NotFoundException } from '@nestjs/common';
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
  async updateSlotStatus(doctorId: string, slot: string, status: boolean) {
    if(slot===undefined || status===undefined){
      throw new NotFoundException("cannot match the body please enter the body to update the slot")
    }
    return this.doctorModel.updateOne(
      { _id: doctorId, 'slots.time': slot },
      { $set: { 'slots.$.booked': status } }
    );
  }
  

}
