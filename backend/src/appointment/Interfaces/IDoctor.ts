import { Types } from "mongoose";

export interface IDoctor {
    _id: Types.ObjectId;
    name: string;
    specialization: string;
    slots: string[];
  }