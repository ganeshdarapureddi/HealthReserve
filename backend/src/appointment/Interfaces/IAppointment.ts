import { Types } from "mongoose";
import { IDoctor } from "./IDoctor";
import { IUser } from "./IUser";

export interface IAppointment {
    _id: Types.ObjectId;
    patientName: string;
    doctor: IDoctor 
    user: IUser  
    slot: string;
  }