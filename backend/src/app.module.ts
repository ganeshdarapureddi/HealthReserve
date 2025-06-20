import { Module } from '@nestjs/common';

import { UserController } from './user/user.controller';
import { AppointmentService } from './appointment/appointment.service';
import { AppointmentController } from './appointment/appointment.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { DoctorService } from './doctor/doctor.service';
import { DoctorController } from './doctor/doctor.controller';
import { Doctor, DoctorSchema } from './doctor/doctor.schema';
import { User, UserSchema } from './user/user.schema';
import {
  Appointment,
  AppointmentSchema,
} from './appointment/appointment.schema';
import { UserService } from './user/user.service';
import { AuthController } from './auth/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './auth/jwt.strategy';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/healthreserve'),
    MongooseModule.forFeature([
      { name: Doctor.name, schema: DoctorSchema },
      { name: User.name, schema: UserSchema },
      { name: Appointment.name, schema: AppointmentSchema },
    ]),
    ConfigModule.forRoot({
      isGlobal: true, // Optional: makes config available in all modules
      envFilePath: '.env', // Optional: default is .env
    }),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),


  ],
  controllers: [
    UserController,
    AppointmentController,
    DoctorController,
    AuthController,
  ],
  providers: [UserService, AppointmentService, DoctorService, JwtStrategy],
  exports: [JwtModule],
})


export class AppModule {}
