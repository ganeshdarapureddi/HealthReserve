// export type Doctor = {
//     _id: string;
//     name: string;
//     specialization: string;
//     experience: number;
//     slots:{time:string;booked:boolean}[]
//   };

//   export interface User {
//     name: string;
//     email: string;
//     phone:string;
//     password: string;
//     role: 'admin' | 'user';
//   }

export interface IDoctor {
  _id: string;
  name: string;
  specialization: string;
  experience: number;
  slots: {
    time: string;
    booked: boolean;
  }[];
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export interface IAppointment {
  _id: string;
  patientName: string;
  doctor: IDoctor;
  user: IUser;
  date: string;
  slot: string;
  status:string;
  createdAt:Date;
}
