import { getAppointments } from '@/app/lib/data';
import AppointmentTable from '@/app/ui/admin/appointmentTable';

export default async function AdminDashboard() {
    const appointments=await getAppointments();
  return (
    <div style={{ padding: '2rem' }}>
      <h1>All Appointments</h1>
      <AppointmentTable appointments={appointments} />
    </div>
  );
}
