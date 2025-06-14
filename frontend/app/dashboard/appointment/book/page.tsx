import { getDoctors } from '@/app/lib/data';
import AppointmentForm from '@/app/ui/appointments/appointment-form';

export default async function AppointmentBookingPage() {
  const doctors=await getDoctors();
  return (
    <main>
      <h1 className="text-2xl font-semibold mb-6 text-center">Book an Appointment</h1>
      <AppointmentForm doctors={doctors} />
    </main>
  );
}
