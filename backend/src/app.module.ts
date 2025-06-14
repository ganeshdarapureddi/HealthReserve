import { Module } from '@nestjs/common';

import { UserController } from './user/user.controller';
import { AppointmentService } from './appointment/appointment.service';
import { AppointmentController } from './appointment/appointment.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { DoctorService } from './doctor/doctor.service';
import { DoctorController } from './doctor/doctor.controller';
import { Doctor, DoctorSchema } from './doctor/doctor.schema';
import { User, UserSchema } from './user/user.schema';
import { Appointment, AppointmentSchema } from './appointment/appointment.schema';
import { UserService } from './user/user.service';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';

@Module({
  imports: [
    MongooseModule.forRoot("mongodb://127.0.0.1:27017/healthreserve"),
    MongooseModule.forFeature([
      {name:Doctor.name,schema:DoctorSchema},
      {name:User.name,schema:UserSchema},
      {name:Appointment.name,schema:AppointmentSchema}
    ])
  ],
  controllers: [ UserController, AppointmentController, DoctorController, AuthController],
  providers: [UserService, AppointmentService, DoctorService, AuthService],
})
export class AppModule {}
