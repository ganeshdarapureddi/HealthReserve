'use client';


import './dashboard.css';
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
    <div className="dashboard">
      <h1>Welcome {name} ({role})</h1>

      <div className="dashboard-cards">
        <div className="dashboard-card">
          Appointments: {role === 'admin' ? totalAppointments : userAppointments}
        </div>
        <div className="dashboard-card">Doctors: {totalDoctors}</div>
        {role === 'admin' && (
          <div className="dashboard-card">Users: {totalUsers}</div>
        )}
      </div>

      <div className="dashboard-links">
        {role === 'admin' ? (
          <Link href="/dashboard/admin" className="dashboard-button">Manage Appointments</Link>
        ) : (
          <>
          {!(userAppointments==1 )&& <Link href="dashboard/appointment/book" className="dashboard-button">Book Appointment</Link>}
            
            <Link href="/dashboard/appointment" className="dashboard-button">My Appointments</Link>
          </>
        )}
      </div>
    </div>
  );
}
