import { getAppointments } from '@/lib/data';
import AppointmentTable from '@/components/admin/appointmentTable';
import { redirect } from 'next/navigation';

export default async function AdminDashboard() {
  try {
    // const appointments = await getAppointments();
    return (
      <div className='p-2'>
        <h1 className='text-3xl text-transparent bg-clip-text bg-gradient-to-r from-purple-900 to-purple-500 font-Serif mb-6 text-center'>All Appointments</h1>
        <AppointmentTable/>
      </div>
    );
  }
  catch (err: any) {
    if (err.message === "unauthorized") {
      redirect("/api/logout");
    }
    throw err;
  }
}