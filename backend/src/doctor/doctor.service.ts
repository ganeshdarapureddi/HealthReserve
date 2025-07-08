// src/doctors/doctor.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Doctor, DoctorDocument } from './doctor.schema';


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
      { $set: { 'slots.$.booked': status } },
    );
  }

  // CRON JOB: Runs every day at 12:01 AM
  // @Cron('50 16 * * *',{
  //   timeZone: 'Asia/Kolkata'
  // }) // or use '0 0 * * *' for 12:00 exactly
  // async resetAllSlotStatuses() {
  //   await this.doctorModel.updateMany(
  //     {},
  //     { $set: { 'slots.$[].booked': false } }
  //   );
  //   console.log('All doctor slots reset to unbooked at midnight.');
  // }
}
