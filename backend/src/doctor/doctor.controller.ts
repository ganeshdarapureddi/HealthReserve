// src/doctors/doctor.controller.ts
import {
  Controller,
  Post,
  Get,
  Body,
  Patch,
  Param,
  UseGuards,
  Delete,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { Doctor } from './doctor.schema';
import { UpdateSlotStatusDto } from './Dto/updateSlotStatusDto';
import { ApiBearerAuth, ApiBody, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { CreateDoctorDto } from './Dto/createDoctorDto';
import { UpdateDoctorDto } from './Dto/updateDoctorDto';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guard';
import { AppointmentService } from 'src/appointment/appointment.service';

@ApiBearerAuth('jwt-auth') //should be added to get the authorize button at top
@UseGuards(JwtAuthGuard)
@Controller('doctors')
export class DoctorController {
  constructor(
    private readonly doctorService: DoctorService,
    private readonly appointmentService: AppointmentService,
  ) {}
  @Get()
  async getAllDoctors(): Promise<Doctor[]> {
    return this.doctorService.findAll();
  }

  @Get(':id/slots')
  async getDoctorSlotsForDate(
    @Param('id') doctorId: string,
    @Query('date') date: string,
  ) {
    const doctor = await this.doctorService.findById(doctorId);
    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    const appointments = await this.appointmentService.findByDoctorAndDate(
      doctorId,
      date,
    );
    const bookedSlots = appointments.map((a) => a.slot);

    const slotsWithStatus = doctor.slots.map((slot) => ({
      time: slot.time,
      booked: bookedSlots.includes(slot.time),
    }));

    return slotsWithStatus;
  }

  @Roles('admin')
  @UseGuards(RolesGuard)
  @Post()
  async createDoctor(
    @Body() createDoctorDto: CreateDoctorDto,
  ): Promise<Doctor> {
    return this.doctorService.create(createDoctorDto);
  }

  @Roles('admin')
  @UseGuards(RolesGuard)
  @Patch('/update-doctor/:id')
  @ApiParam({ name: 'id', description: 'Doctor ID' })
  async updateDoctor(
    @Param('id') id: string,
    @Body() updateDoctorDto: UpdateDoctorDto,
  ) {
    return this.doctorService.update(id, updateDoctorDto);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', description: 'Doctor ID' })
  async deleteDoctor(@Param('id') id: string) {
    return this.doctorService.delete(id);
  }


}
