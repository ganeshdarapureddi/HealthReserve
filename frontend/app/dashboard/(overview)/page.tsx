// app/dashboard/page.tsx
import { cookies } from 'next/headers';
import DashboardUI from '@/app/ui/dashboard/dashboard';
import { getAppointments, getDoctors, getUsers, getUserById } from '@/app/lib/data';

import { validateToken } from '@/app/lib/auth';

export default async function DashboardPage() {
  const cookieStore = cookies();
  const userId1 = (await cookieStore).get('userId')?.value;
  const userId=validateToken(userId1)


  if (!userId) {
    return <p>Unauthorized: No user ID found in cookies.</p>;
  }

  const [appointments, users, doctors, user] = await Promise.all([
    getAppointments(),
    getUsers(),
    getDoctors(),
    getUserById(userId), 
  ]);

  const userAppointments = appointments.filter(
    (appointment) => appointment.user._id === userId
  );

  return (
    <DashboardUI
      role={user.role || ''}
      name={user?.name || ''}
      totalAppointments={appointments.length}
      userAppointments={userAppointments.length}
      totalDoctors={doctors.length}
      totalUsers={users.length}
    />
  );
}
