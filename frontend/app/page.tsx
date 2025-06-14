import Link from 'next/link';
import Image from 'next/image';


export default function IntroductionPage() {
  return (
    <main className="p-12">
    <section className="min-h-screen flex flex-col flex-wrap justify-center items-center md:flex-row ">
      <div className="md:w-1/2">
        <h1 className='font-bold text-3xl  font-sans mb-10'>Welcome to <span className="text-6xl  font-normal bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-900">Health Reserve</span></h1>
        <p className='w-3/4 text-gray-500 mb-7 font-serif line-'>
          HealthReserve is your all-in-one platform for managing health. <br />
          Book appointments with top-rated doctors anytime, anywhere. <br />
          Stay organized with your personalized health schedule. <br />
          Access all your wellness needs in a single,  simple dashboard. <br />
          Take control of your health journey—seamlessly and securely. <br />
        </p>
        <div className='gap-4 flex mb-4'>
          <Link
            href="/dashboard/doctors"
            className="text-white bg-purple-900 border-2 border-purple-950 p-1 px-3 rounded-sm hover:bg-white hover:text-purple-950 transition"            >
            Explore Doctors
          </Link>  
          <Link href="/dashboard/appointment" className="border-2 border-purple-900 text-purple-950 p-1 px-3 rounded-sm hover:bg-purple-900 hover:text-white">Make an Appointment</Link>
        </div>
      </div>
      <div className="md:w-1/2 shadow-2xl rounded-2xl ">
        <Image
          src="/Intro-Doctor.png"
          width={900}
          height={900}
          alt="Intro Image"
          className='rounded-2xl'
        />
      </div>
    </section>
  </main>
  );
}
