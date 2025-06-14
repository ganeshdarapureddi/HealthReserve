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

  export interface Doctor {
    _id: string;
    name: string;
    specialization: string;
    experience: number;
    slots: {
      time: string;
      booked: boolean;
    }[];
  }
  
  export interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
  }
  
  export interface Appointment {
    _id: string;
    patientName: string;
    doctor: Doctor;
    user: User;
    slot: string;
  }
  