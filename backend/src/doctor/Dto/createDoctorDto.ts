import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDoctorDto {
  @ApiProperty({ example: 'Dr. Ganesh' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Cardiology' })
  @IsString()
  @IsNotEmpty()
  specialization: string;

  @ApiProperty({ example: 10 })
  @IsNumber()
  experience: number;

  @ApiProperty({
    example: ['10:00 AM - 10:30 AM', '10:30 AM - 11:00 AM'],
    description: 'Array of available time slots',
  })
  @IsArray()
  @IsString({ each: true })
  slots: string[];
}
