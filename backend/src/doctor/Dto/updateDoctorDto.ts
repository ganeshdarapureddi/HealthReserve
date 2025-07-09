import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateDoctorDto {
  @ApiPropertyOptional({ example: 12 })
  @IsOptional()
  @IsNumber()
  experience?: number;

  @ApiPropertyOptional({
    example: ['3:00 PM - 3:30 PM', '3:30 PM - 4:00 PM'],
    description: 'New time slots (existing slots will be replaced)',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  slots?: string[];
}
