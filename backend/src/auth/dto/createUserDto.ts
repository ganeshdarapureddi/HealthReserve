import { IsEmail, IsNotEmpty, Matches, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @Matches(/^[6-9]\d{9}$/, { message: 'Phone number must be valid 10 digits starting with 6-9' })
  phone: string;

  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;
}

