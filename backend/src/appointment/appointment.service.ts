import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Appointment, AppointmentDocument } from './appointment.schema';
import { Model } from 'mongoose';
import { CreateAppointmentDto } from './dto/createAppointmentDto';
import { AppointmentStatus } from './enums/appointmentStatus';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectModel(Appointment.name)
    private appointmentModel: Model<AppointmentDocument>,
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

  const searchRegex = new RegExp(search, 'i'); // case-insensitive

  const query = search
    ? {
        $or: [
          { patientName: { $regex: searchRegex } },
          { 'doctor.name': { $regex: searchRegex } }
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
}
