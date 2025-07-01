import { getDoctors } from '@/lib/data';
import AppointmentForm from '@/components/appointments/appointment-form';
import { redirect } from 'next/navigation';

export default async function AppointmentBookingPage() {

  try{
    const doctors=await getDoctors();
    return (
      <main>
        <h1 className="text-3xl text-transparent bg-clip-text bg-gradient-to-r from-purple-900 to-purple-500 font-Serif mb-6 text-center">Book an Appointment</h1>
        <AppointmentForm doctors={doctors} />
      </main>
    );
  }
  catch(err:any){
    if(err.message==="unauthorized"){
      redirect("/api/logout");
    }
  }
}
