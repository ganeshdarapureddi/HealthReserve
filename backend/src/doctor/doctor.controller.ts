// src/doctors/doctor.controller.ts
import { Controller, Post, Get, Body, Patch, Param } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { Doctor } from './doctor.schema';

@Controller('doctors')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}
  @Get()
  async getAllDoctors(): Promise<Doctor[]> {
    return this.doctorService.findAll();
  }

  @Patch(':id')
  async updateSlotStatus(
    @Param('id') doctorId: string,
    @Body() body: { slot: string; status: boolean }
  ) {
    const { slot, status } = body;
    return this.doctorService.updateSlotStatus(doctorId, slot, status);
  }
}
