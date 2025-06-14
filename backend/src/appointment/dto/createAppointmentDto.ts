import { IsString } from 'class-validator';

export class CreateAppointmentDto {
  @IsString()
  patientName: string;

  @IsString()
  user: string;

  @IsString()
  doctor: string;

  @IsString()
  slot: string;
}
