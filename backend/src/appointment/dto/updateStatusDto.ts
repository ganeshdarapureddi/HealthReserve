import {ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { AppointmentStatus } from '../enums/appointmentStatus';

export class UpdateStatusDto {
    @ApiProperty()
    @IsEnum(AppointmentStatus, { message: 'Status must be pending or completed' })
    status: AppointmentStatus;
  }
