// src/appointments/appointments.controller.ts
import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import {  AppointmentDocument } from './appointment.schema';
import { CreateAppointmentDto } from './dto/createAppointmentDto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';

@ApiBearerAuth('jwt-auth')//should be added to get the authorize button at top 
@UseGuards(JwtAuthGuard)
@Controller('appointments')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Roles('admin')
  @UseGuards(RolesGuard)
  @Get()
  async getAll(): Promise<AppointmentDocument[]> {
    return await this.appointmentService.findAll();
  }
  

  @Get(":id")
  async getByUserId(@Param("id") id : string):Promise<AppointmentDocument[]>{
    return this.appointmentService.findByUserId(id);  
  }


  @Post()
  async createAppointment(@Body() createAppointmentDto: CreateAppointmentDto) {

    console.log('Received appointment DTO:', createAppointmentDto); 
    const { patientName, user,doctor,date, slot } = createAppointmentDto;

    const appointment=await this.appointmentService.create({patientName,doctor,user,date,slot}) 
         
    return appointment.toObject();
  }
  

  @Roles('admin')
  @UseGuards(RolesGuard)
  @Delete('delete/:id')
  async delete(@Param('id') id: string):Promise<AppointmentDocument> {
    const deleted= await this.appointmentService.delete(id);
    return deleted;
  }
} 
