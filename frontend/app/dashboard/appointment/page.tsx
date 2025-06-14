import Link from 'next/link';
import './appointments.css';
import { getUserAppointment } from '@/app/lib/action';

export default async function AppointmentsPage() {
  const appointment = await getUserAppointment();


  return (
    <main className="appointment-page">
      <h1>Your Appointment</h1>
      {appointment ? (
        <div className="appointment-card">
          <p><strong>Patient Name:</strong> {appointment.patientName}</p>
          <p><strong>Doctor:</strong> {appointment.doctor?.name}</p>
          <p><strong>Specialization:</strong> {appointment.doctor?.specialization}</p>
          <p><strong>Slot:</strong> {appointment.slot}</p>
        
        </div>
      ) : (
        <div className="no-appointment">
          <p>No appointment booked yet.</p>
          <Link href="/dashboard/appointment/book" className="book-btn">
            Book Appointment
          </Link>
        </div>
      )}
    </main>
  );
}