// app/dashboard/page.tsx

import DashboardUI from '@/components/dashboard/dashboard';
import {
  getAppointments,
  getDoctors,
  getUsers,
  getUserById,
  getAppointmentByUserId
} from '@/lib/data';
import { GetCookie } from '@/lib/cookieStore/getCookie';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {

  try {

    const userId = await GetCookie("userId");
    const userRole = await GetCookie("userRole");


    const [user, doctors] = await Promise.all([getUserById(userId), getDoctors()])

    let totalAppointments = 0;
    let userAppointments = 0;
    let totalDoctors = 0;
    let totalUsers = 0;

    totalDoctors = doctors.length;

    if (userRole === 'admin') {
      const [appointments, users] = await Promise.all([
        getAppointments(),
        getUsers(),

      ]);

      totalAppointments = appointments.length;

      totalUsers = users.length;


    }
    else {
      const userAppointment = await getAppointmentByUserId(userId);
      const res = await userAppointment.json();
      console.log("userAppointments from dashboard page", res)
      if (res.length !== 0) {
        userAppointments = 1;
      }
    }

    return (
      <DashboardUI
        role={user.role || ''}
        name={user?.name || ''}
        totalAppointments={totalAppointments}
        userAppointments={userAppointments}
        totalDoctors={totalDoctors}
        totalUsers={totalUsers}
      />

    );
  }

  catch (err: any) {
    if (err.message === "unauthorized") {
      redirect("/api/logout");
    }
    throw err;
  }

}
