import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Appointment, AppointmentDocument } from './appointment.schema';
import { Model } from 'mongoose';
import { CreateAppointmentDto } from './dto/createAppointmentDto';
import { AppointmentStatus } from './enums/appointmentStatus';
import { Cron } from '@nestjs/schedule';
import { Doctor, DoctorDocument } from 'src/doctor/doctor.schema';


@Injectable()
export class AppointmentService {
  
  constructor(
    @InjectModel(Appointment.name)
    private appointmentModel: Model<AppointmentDocument>,
    @InjectModel(Doctor.name) private doctorModel: Model<DoctorDocument>,
  ) {}

  async findAll(): Promise<AppointmentDocument[]> {
    return await this.appointmentModel
      .find()
      .populate('doctor')
      .populate('user')
      .exec();
  }

  async create(
    createAppointmentDto: CreateAppointmentDto,
  ): Promise<AppointmentDocument> {
    const appointment = await this.appointmentModel.create({
      patientName: createAppointmentDto.patientName,
      doctor: createAppointmentDto.doctor,
      user: createAppointmentDto.user,
      date: createAppointmentDto.date,
      slot: createAppointmentDto.slot,
      createdAt: new Date(),
    });
    appointment.save();
    return (await appointment.populate('user')).populate('doctor');
  }

  async findOneByDoctorDateSlot(doctorId: string, date: string, slot: string) {
    return this.appointmentModel.findOne({
      doctor: doctorId,
      date,
      slot,
      status: { $ne: 'cancelled' }, // Optional: ignore cancelled ones
    });
  }

  async findByDoctorAndDate(
    doctorId: string,
    date: string
  ): Promise<Appointment[]> {
    return this.appointmentModel.find({
      doctor: doctorId,
      date,
      status: { $ne: 'cancelled' },
    });
  } 
  


  async delete(id: string): Promise<AppointmentDocument> {
    const deleted = await this.appointmentModel.findByIdAndDelete(id);

    if (!deleted) {
      throw new NotFoundException('Appointment not found');
    }

    return (await deleted.populate('doctor')).populate('user');
  }

  async findByUserId(userId: string): Promise<AppointmentDocument[]> {
    const appointments = await this.appointmentModel
      .find({ user: userId })
      .populate('user')
      .populate('doctor')
      .exec();
    console.log('appointments from backend', appointments);
    return appointments;
  }

  async updateStatus(
    id: string,
    status: AppointmentStatus,
  ): Promise<AppointmentDocument> {
    const updated = await this.appointmentModel.findByIdAndUpdate(id, {
      status,
    });
    if (!updated) {
      throw new NotFoundException(`Appointment with id ${id} not found`);
    }
    return (await updated.populate('doctor')).populate('user');
  }

  async getPaginatedAppointments(page: number, limit: number, search: string) {
    const skip = (page - 1) * limit;

    const searchRegex = new RegExp(search, 'i');

    const query = search
      ? {
          $or: [
            { patientName: { $regex: searchRegex } }, 
            { date: { $regex: searchRegex } },
            { slot: { $regex: searchRegex } },
            { status: { $regex: searchRegex } },
          ],
        }
      : {};

    const [appointments, total] = await Promise.all([
      this.appointmentModel
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('doctor')
        .populate('user')
        .exec(),
      this.appointmentModel.countDocuments(query),
    ]);

    return {
      data: appointments,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit), 
    };
  }



  @Cron('1 0 * * *', { timeZone: 'Asia/Kolkata' })
  async cancelExpiredAppointments() {
    console.log("cron ran")
    const now = new Date();
    const expiredAppointments = await this.appointmentModel
      .find({
        status: AppointmentStatus.Pending,
      })
      .populate('doctor');

    for (const appt of expiredAppointments) {
      console.log(' Appointment Date:', appt.date);
      console.log(' Appointment Slot:', appt.slot);
      console.log(' Current Time:', now);

      await this.appointmentModel.updateOne(
        { _id: appt._id },
        { $set: { status: AppointmentStatus.Cancelled } },
      );
      
      console.log(`Cancelled appointment ${appt._id}`);
    }

  }
}

// async findById(id: string): Promise<Appointment> {
//   const appointment = await this.appointmentModel.findById(id).populate('doctorId').populate('userID');
//   if (!appointment) throw new NotFoundException('Appointment not found');
//   return appointment;
// }

// async findByAppointmentId(appointmentId: string): Promise<AppointmentDocument[]> {

//   const appointments = await this.appointmentModel
//     .find({_id: appointmentId })
//     .populate('user')
//     .populate('doctor')
//     .exec();
//   return appointments;
// }
