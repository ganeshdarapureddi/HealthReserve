'use client';

import Link from 'next/link';

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
          <Link
            href="/dashboard/admin"
            className="px-6 py-3 text-white font-semibold rounded-lg bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-center transition"
          >
            Manage Appointments
          </Link>
        ) : (
          <>
            {userAppointments !== 1 && (
              <Link
                href="/dashboard/appointment/book"
                className="px-6 py-3 text-white font-semibold rounded-lg bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-center transition"
              >
                Book Appointment
              </Link>
            )}
            <Link
              href="/dashboard/appointment"
              className="px-6 py-3 text-white font-semibold rounded-lg bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-center transition"
            >
              My Appointments
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
