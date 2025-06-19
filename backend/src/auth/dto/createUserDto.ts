import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Matches, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @ApiProperty()
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @ApiProperty()
  @Matches(/^[6-9]\d{9}$/, { message: 'Phone number must be valid 10 digits starting with 6-9' })
  phone: string;

  @ApiProperty()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;
}

