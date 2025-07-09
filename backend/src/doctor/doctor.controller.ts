// src/doctors/doctor.controller.ts
import { Controller, Post, Get, Body, Patch, Param, UseGuards, Delete } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { Doctor } from './doctor.schema';
import { UpdateSlotStatusDto } from './Dto/updateSlotStatusDto';
import { ApiBearerAuth, ApiBody, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { CreateDoctorDto } from './Dto/createDoctorDto';
import { UpdateDoctorDto } from './Dto/updateDoctorDto';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guard';


@ApiBearerAuth('jwt-auth')//should be added to get the authorize button at top 
@UseGuards(JwtAuthGuard)
@Controller('doctors')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}
  @Get()
  async getAllDoctors(): Promise<Doctor[]> {
    return this.doctorService.findAll();
  }
  
  @Roles("admin")
  @UseGuards(RolesGuard)
  @Post()
  async createDoctor(@Body() createDoctorDto: CreateDoctorDto): Promise<Doctor> {
    return this.doctorService.create(createDoctorDto);
  }

  @Roles("admin")
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
  async deleteDoctor( 
    @Param('id') id: string
  ) {
    return this.doctorService.delete(id);
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
