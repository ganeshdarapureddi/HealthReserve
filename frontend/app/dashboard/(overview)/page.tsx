// app/dashboard/page.tsx

import DashboardUI from '@/app/ui/dashboard/dashboard';
import {
  getAppointments,
  getDoctors,
  getUsers,
  getUserById,
  getAppointmentByUserId
} from '@/app/lib/data';
import { GetCookie } from '@/app/lib/cookieStore/getCookie';

export default async function DashboardPage() {
  const userId = await GetCookie("userId");
  const userRole = await GetCookie("userRole");

  if (!userId) {
    return <p>Unauthorized: No user ID found in cookies.</p>;
  }

  const [user,doctors] = await Promise.all([getUserById(userId),getDoctors()])

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
  else{
    const userAppointment=await getAppointmentByUserId(userId);
    const res=await userAppointment.json();
    console.log("userAppointments from dashboard page",res)
    if(res.length!==0){
      userAppointments=1;
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
