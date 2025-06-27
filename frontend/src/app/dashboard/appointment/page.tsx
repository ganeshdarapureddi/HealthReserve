import Link from 'next/link';
import { getUserAppointment } from '@/lib/action';
import { redirect } from 'next/navigation';

export default async function AppointmentsPage() {
  try {

    const appointment = await getUserAppointment();

    return (
      <main className="flex min-h-screen justify-center items-center ">

        {appointment ? (
          <div className="border-none p-25  rounded-2xl shadow-2xl bg-gradient-to-br from-purple-600 to-pink-700 max-w-xl mx-auto ">
            <h1 className="text-center text-4xl text-white mb-8 font-bold">Your Appointment</h1>

            <table className="text-white text-2xl font-serif">
              <tbody>
                <tr className="border-b border-white/30">
                  <td className="py-2 pr-4 font-bold">Patient Name</td>
                  <td className="py-2">:  {appointment.patientName}</td>
                </tr>
                <tr className="border-b border-white/30">
                  <td className="py-2 pr-4 font-bold">Doctor</td>
                  <td className="py-2">:  {appointment.doctor?.name}</td>
                </tr>
                <tr className="border-b border-white/30">
                  <td className="py-2 pr-4 font-bold">Specialization</td>
                  <td className="py-2">:  {appointment.doctor?.specialization}</td>
                </tr>
                <tr className="border-b border-white/30">
                  <td className="py-2 pr-4 font-bold">Date</td>
                  <td className="py-2">:  {appointment.date}</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-bold">Slot</td>
                  <td className="py-2 ">:  {appointment.slot}</td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center space-y-6'>
            <p className='border-none p-15 space-y-4 rounded-2xl shadow-2xl bg-gradient-to-r from-purple-300 to-purple-50 font-bold font-sans'>No appointment booked yet.</p>
            <Link href="/dashboard/appointment/book" className="px-6 py-3 text-white font-semibold rounded-lg bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-center transition">
              Book Appointment
            </Link>
          </div>

        )}
      </main>
    );

  }
  catch (err: any) {
    if (err.message === "unauthorized") {
      redirect("/api/logout");
    }
  }
}