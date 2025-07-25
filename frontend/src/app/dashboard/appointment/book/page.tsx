import { getDoctors } from '@/lib/data';
import AppointmentForm from '@/components/appointments/appointment-form';
import { redirect } from 'next/navigation';
import GetTokenFromCookie from '@/lib/cookieStore/getCookie';

export default async function AppointmentBookingPage() {

  try {
    const doctors = await getDoctors();
    const token = await GetTokenFromCookie("token");
    return (
      <main>
        <h1 className="text-3xl text-transparent bg-clip-text bg-gradient-to-r from-purple-900 to-purple-500 font-Serif mb-6 text-center">
          Book an Appointment
        </h1>

        {doctors.length === 0 ? (
          <p className="text-center text-red-500 font-medium">No doctors available. Please try again later.</p>
        ) : (
          <AppointmentForm doctors={doctors} token={token} />
        )}
      </main>
    );
  }
  catch (err: any) {
    if (err.message === "unauthorized") {
      redirect(`/expire?from=/dashboard/appointment/book`);
    }
    throw err;
  }
}
