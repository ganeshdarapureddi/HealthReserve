import { getDoctors } from '@/app/lib/data';
import AppointmentForm from '@/app/ui/appointments/appointment-form';

export default async function AppointmentBookingPage() {
  const doctors=await getDoctors();
  return (
    <main>
      <h1 className="text-3xl text-transparent bg-clip-text bg-gradient-to-r from-purple-900 to-purple-500 font-Serif mb-6 text-center">Book an Appointment</h1>
      <AppointmentForm doctors={doctors} />
    </main>
  );
}
