import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, isBoolean, IsString } from 'class-validator';

export class UpdateSlotStatusDto {
  @ApiProperty()
  @IsString()
  slot: string;

  @ApiProperty()
  @IsBoolean()
  status: boolean;
}
