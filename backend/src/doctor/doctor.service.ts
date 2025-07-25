import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Doctor, DoctorDocument } from './doctor.schema';
import { CreateDoctorDto } from './Dto/createDoctorDto';
import { UpdateDoctorDto } from './Dto/updateDoctorDto';

@Injectable()
export class DoctorService {
  constructor(
    @InjectModel(Doctor.name) private doctorModel: Model<DoctorDocument>,
  ) {}

  async findAll(): Promise<Doctor[]> {
    return this.doctorModel.find().exec();
  }

  async findById(id: string): Promise<Doctor | null> {
    return this.doctorModel.findById(id);
  }

  async create(createDoctorDto: CreateDoctorDto): Promise<Doctor> {
    const { slots, ...rest } = createDoctorDto;

    const transformedSlots = slots.map((time) => ({
      time,
    }));

    const createdDoctor = new this.doctorModel({
      ...rest,
      slots: transformedSlots,
    });

    return createdDoctor.save();
  }

  async update(id: string, updateDto: UpdateDoctorDto): Promise<Doctor> {
    const updateData: Partial<Doctor> = {};
    if (updateDto.experience !== undefined) {
      updateData.experience = updateDto.experience;
    }
    if (updateDto.slots) {
      updateData.slots = updateDto.slots.map((time) => ({
        time,
      }));
    }
    const updatedDoctor = await this.doctorModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true },
    );
    if (!updatedDoctor) {
      throw new NotFoundException('Doctor not found');
    }
    return updatedDoctor;
  }

  async delete(id: string): Promise<Doctor> {
    const deletedDoctor = await this.doctorModel.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );
    if (!deletedDoctor) {
      throw new NotFoundException('Doctor not found');
    }
    return deletedDoctor;
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
