import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateAppointmentDto {
  @ApiProperty()
  @IsString()
  patientName: string;

  @ApiProperty()
  @IsString()
  user: string;

  @ApiProperty()
  @IsString()
  doctor: string;

  @ApiProperty()
  @IsString()
  slot: string;
}
