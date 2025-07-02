// src/doctors/doctor.controller.ts
import { Controller, Post, Get, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { Doctor } from './doctor.schema';
import { UpdateSlotStatusDto } from './Dto/updateSlotStatusDto';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';


@ApiBearerAuth('jwt-auth')//should be added to get the authorize button at top 
@UseGuards(JwtAuthGuard)
@Controller('doctors')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}
  @Get()
  async getAllDoctors(): Promise<Doctor[]> {
    return this.doctorService.findAll();
  }
  
  @Patch(':id')
  @ApiBody({ type:UpdateSlotStatusDto  })
  async updateSlotStatus(
    @Param('id') doctorId: string,
    @Body() updateSlotStatusDto: UpdateSlotStatusDto
  ) {
    // console.log(updateSlotStatusDto)
    // console.log(updateSlotStatusDto.slot)
    // console.log(slot,status)
    return this.doctorService.updateSlotStatus(doctorId, updateSlotStatusDto.slot, updateSlotStatusDto.status);
  }
}
