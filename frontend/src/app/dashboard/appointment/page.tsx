import Link from 'next/link';
import { getUserAppointment } from '@/lib/action';
import { redirect } from 'next/navigation';

export default async function AppointmentsPage() {
  try {
    const appointments = await getUserAppointment();

    if (!appointments || appointments.length === 0) {
      return (
        <main className="flex min-h-screen justify-center items-center">
          <div className="flex flex-col items-center justify-center space-y-6">
            <p className="border-none mb-15 p-15 space-y-4 rounded-2xl shadow-xl bg-gradient-to-r from-purple-300 to-purple-50 font-bold font-sans">
              No appointment booked yet.
            </p>
            <Link
              href="/dashboard/appointment/book"
              className="px-6 py-3 text-white font-semibold rounded-lg bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-center transition"
            >
              Book Appointment
            </Link>
          </div>
        </main>
      );
    }

    // Sort appointments by latest date first
    const sortedAppointments = appointments.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    const hasPending = sortedAppointments.some((a) => a.status === 'pending');

    return (
      <main className="flex min-h-screen justify-center items-start p-10 bg-gray-50">
        <div className="w-full max-w-7xl">
          <h1 className="text-3xl font-bold text-purple-800 mb-6 text-center">
            Your Appointments
          </h1>

          <div className="rounded-xl shadow-lg overflow-x-auto">
            <div className="max-h-[300px] overflow-y-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-purple-300 text-purple-800 sticky top-0 z-10">
                    <th className="px-4 py-3 text-left border-b border-gray-100">S.No</th>
                    <th className="px-4 py-3 text-left border-b border-gray-100">Patient</th>
                    <th className="px-4 py-3 text-left border-b border-gray-100">Doctor</th>
                    <th className="px-4 py-3 text-left border-b border-gray-100">Date</th>
                    <th className="px-4 py-3 text-left border-b border-gray-100">Slot</th>
                    <th className="px-4 py-3 text-left border-b border-gray-100">Status</th>
                  </tr>
                </thead>
                <tbody>   
                  {sortedAppointments.map((a, index) => (
                    <tr
                      key={a._id}
                      className="border-b border-gray-100 hover:bg-purple-50 transition duration-200"
                    >
                      <td className="px-4 py-3 text-gray-600 font-medium">{index + 1}</td>
                      <td className="px-4 py-3 capitalize">{a.patientName}</td>
                      <td className="px-4 py-3 capitalize">{a.doctor?.name || '-'}</td>
                      <td className="px-4 py-3">{a.date}</td>
                      <td className="px-4 py-3">{a.slot}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block w-28 text-center px-3 py-1 rounded-full text-sm font-bold tracking-wide uppercase
                            ${
                              a.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : a.status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : a.status === 'cancelled'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-100 text-gray-800'
                            }
                          `}
                        >
                          {a.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {!hasPending && (
            <div className="flex justify-center mt-6">
              <Link
                href="/dashboard/appointment/book"
                className="px-6 py-3 text-white font-semibold rounded-lg bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-center transition"
              >
                Book Appointment
              </Link>
            </div>
          )}
        </div>
      </main>
    );
  } catch (err: any) {
    if (err.message === 'unauthorized') {
      redirect(`/expire?from=/dashboard/appointment`);
    }
    throw err;
  }
}
