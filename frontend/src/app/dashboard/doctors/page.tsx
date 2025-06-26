import { getDoctors } from '@/lib/data';
import { DoctorCard } from '@/components/doctors/DoctorCard';


export default async function DoctorsPage() {
  const doctors = await getDoctors();

  return (
    <main className="">
      <h1 className='text-center text-3xl text-purple-800 mb-10'>Our Doctors</h1>
      <div className="flex flex-wrap justify-between gap-y-5">
        {doctors.map((doc) => (
          <DoctorCard key={doc._id} doctor={doc} />
        ))}
      </div>
    </main>
  );
}
