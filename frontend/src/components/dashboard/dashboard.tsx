'use client';
import ButtonLink from '../button/ButtonLink';

interface Props {
  role: string;
  name: string;
  totalAppointments: number;
  userAppointments: number;
  pendingAppointments:number;
  totalDoctors: number;
  totalUsers: number;
}

export default function DashboardUI({
  role,
  name,
  totalAppointments,
  userAppointments,
  pendingAppointments,
  totalDoctors,
  totalUsers
}: Props) {

  return (
    <div className="p-8">
    
      <h1 className="text-3xl font-semibold mb-6 text-center">
        Welcome{' '}
        <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-800">
          {name} ({role})
        </span>
      </h1>

  
      <div className="flex flex-wrap justify-center gap-6">
        <div className="p-6 min-w-[280px] bg-gradient-to-br from-pink-500 to-purple-800 text-white text-center rounded-xl shadow-inner">
          <h2 className="text-lg font-semibold tracking-wide">Total Appointments</h2>
          <p className="text-3xl mt-2 font-bold">
            {role === 'admin' ? totalAppointments : userAppointments}
          </p>
        </div>

        <div className="p-6 min-w-[280px] bg-gradient-to-br from-pink-500 to-purple-800 text-white text-center rounded-xl shadow-inner">
          <h2 className="text-lg font-semibold tracking-wide">Pending Appointments</h2>
          <p className="text-3xl mt-2 font-bold">{pendingAppointments}</p>
        </div>

        <div className="p-6 min-w-[280px] bg-gradient-to-br from-pink-500 to-purple-800 text-white text-center rounded-xl shadow-inner">
          <h2 className="text-lg font-semibold tracking-wide">Doctors</h2>
          <p className="text-3xl mt-2 font-bold">{totalDoctors}</p>
        </div>

        {role === 'admin' && (
          <div className="p-6 min-w-[280px] bg-gradient-to-br from-pink-500 to-purple-800 text-white text-center rounded-xl shadow-inner">
            <h2 className="text-lg font-semibold tracking-wide">Users</h2>
            <p className="text-3xl mt-2 font-bold">{totalUsers}</p>
          </div>
        )}
      </div>

        {/* buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
        {role === 'admin' ? (
          <ButtonLink route={"dashboard/admin"}>Manage Appointments</ButtonLink>
        ) : (
          <>
            {pendingAppointments !== 1 && (
              <ButtonLink route={"dashboard/appointment/book"}>Book Appointment</ButtonLink>
            )}
            <ButtonLink route={"dashboard/appointment"}>My Appointment</ButtonLink>
          </>
        )}
      </div>
    </div>
  );
}
