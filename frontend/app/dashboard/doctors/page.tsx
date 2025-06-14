import { getDoctors } from '@/app/lib/data';
import { DoctorCard } from '@/app/ui/doctors/DoctorCard';
import './doctors.css';

export default async function DoctorsPage() {
  const doctors = await getDoctors();

  return (
    <main className="doctors-page">
      <h1>Our Doctors</h1>
      <div className="doctor-grid">
        {doctors.map((doc) => (
          <DoctorCard key={doc._id} doctor={doc} />
        ))}
      </div>
    </main>
  );
}
