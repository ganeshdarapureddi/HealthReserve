import Link from 'next/link';
import { getUserAppointment } from '@/app/lib/action';

export default async function AppointmentsPage() {
  const appointment = await getUserAppointment();
  
  return (
    <main className="flex min-h-screen justify-center items-center ">
      
      {appointment ? (
        <div className="border-none p-25 space-y-4 rounded-2xl shadow-2xl bg-gradient-to-br from-purple-600 to-pink-700">
          <h1 className='text-center text-4xl  text-white mb-10'>Your Appointment</h1>
          <p className='text-2xl text-white font-serif'><strong>Patient Name:</strong> {appointment.patientName}</p>
          <p className='text-2xl text-white font-serif'><strong>Doctor:</strong> {appointment.doctor?.name}</p>
          <p className='text-2xl text-white font-serif'><strong>Specialization:</strong> {appointment.doctor?.specialization}</p>
          <p className='text-2xl text-white font-serif'><strong>Slot:</strong> {appointment.slot}</p>
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