import { getAppointments } from '@/lib/data';
import AppointmentTable from '@/components/admin/appointmentTable';

export default async function AdminDashboard() {
    const appointments=await getAppointments();
  return (
    <div className='p-2'>
      <h1 className='text-3xl text-transparent bg-clip-text bg-gradient-to-r from-purple-900 to-purple-500 font-Serif mb-6 text-center'>All Appointments</h1>
      <AppointmentTable appointments={appointments} />
    </div>
  );
}