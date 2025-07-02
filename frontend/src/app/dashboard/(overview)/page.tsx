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
import { IAppointment } from '@/lib/models';

export default async function DashboardPage() {

  try {

    const userId = await GetCookie("userId");
    const userRole = await GetCookie("userRole");


    const [user, doctors] = await Promise.all([getUserById(userId), getDoctors()])

    let totalAppointments = 0;
    let userAppointments = 0;
    let pendingAppointmentCount=0;
    let totalDoctors = 0;
    let totalUsers = 0;

    totalDoctors = doctors.length;

    if (userRole === 'admin') {
      const [appointments, users] = await Promise.all([
        getAppointments(),
        getUsers(),
      ]);

      totalAppointments = appointments.length;
      const pendingAppointments = appointments.filter((a: IAppointment) => a.status === "pending");
      pendingAppointmentCount=pendingAppointments.length
      totalUsers = users.length;
    }
    else {
      const userAppointment = await getAppointmentByUserId(userId);
      const res = await userAppointment.json();
      // console.log("res from the user appointment",res);
      const pendingAppointments = res.filter((a: IAppointment) => a.status === "pending");
      pendingAppointmentCount = pendingAppointments.length;
      // console.log("res from the user appointment",pendingAppointments);
      // console.log("userAppointments from dashboard page", res);
      userAppointments = res.length;
    }

    return (
      <DashboardUI
        role={user.role || ''}
        name={user?.name || ''}
        totalAppointments={totalAppointments}
        userAppointments={userAppointments}
        pendingAppointments={pendingAppointmentCount}
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
