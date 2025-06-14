// src/appointments/appointments.controller.ts
import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { Appointment, AppointmentDocument } from './appointment.schema';
import { CreateAppointmentDto } from './dto/createAppointmentDto';
import { IAppointment } from './Interfaces/IAppointment';

@Controller('appointments')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Get()
  async getAll(): Promise<AppointmentDocument[]> {
    return await this.appointmentService.findAll();
  }


  @Get(":id")
  async getByUserId(@Param("id") id : string):Promise<AppointmentDocument[]>{
    console.log("")
    return this.appointmentService.findByUserId(id);  
  }

  @Post()
  async createAppointment(@Body() createAppointmentDto: CreateAppointmentDto) {

    console.log('Received appointment DTO:', createAppointmentDto); 
    const { patientName, user,doctor, slot } = createAppointmentDto;

    const appointment=await this.appointmentService.create({patientName,doctor,user,slot}) 
         
    return appointment.toObject();
  }
  

  @Delete('delete/:id')
  async delete(@Param('id') id: string):Promise<AppointmentDocument> {
    const deleted= await this.appointmentService.delete(id);
    return deleted;
  }
} 
