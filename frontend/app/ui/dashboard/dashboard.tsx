'use client';
import ButtonLink from '../button/ButtonLink';

interface Props {
  role: string;
  name: string;
  totalAppointments: number;
  userAppointments: number;
  totalDoctors: number;
  totalUsers: number;
}

export default function DashboardUI({
  role,
  name,
  totalAppointments,
  userAppointments,
  totalDoctors,
  totalUsers
}: Props) {
  return (
    <div className="p-8">
      {/* Welcome Header */}
      <h1 className="text-3xl font-semibold mb-6 text-center">
        Welcome{' '}
        <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-800">
          {name} ({role})
        </span>
      </h1>

      {/* Info Cards */}
      <div className="flex flex-wrap justify-center gap-6">
        <div className="p-6 min-w-[280px] bg-gradient-to-br from-purple-700 to-indigo-800 text-white text-center rounded-xl shadow-lg">
          Appointments: {role === 'admin' ? totalAppointments : userAppointments}
        </div>
        <div className="p-6 min-w-[280px] bg-gradient-to-br from-purple-700 to-indigo-800 text-white text-center rounded-xl shadow-lg">
          Doctors: {totalDoctors}
        </div>
        {role === 'admin' && (
          <div className="p-6 min-w-[280px] bg-gradient-to-br from-purple-700 to-indigo-800 text-white text-center rounded-xl shadow-lg">
            Users: {totalUsers}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
        {role === 'admin' ? (
          <ButtonLink route={"dashboard/admin"}>Manage Appointments</ButtonLink>
        ) : (
          <>
            {userAppointments !== 1 && (
              <ButtonLink route={"dashboard/appointment/book"}>Book Appointment</ButtonLink>
            )}
            <ButtonLink route={"dashboard/appointment"}>My Appointment</ButtonLink>
          </>
        )}
      </div>
    </div>
  );
}
