'use client';

import { useActionState } from 'react';
import { deleteAppointment } from '@/app/lib/action';
import './appointmentTable.css';
import { Appointment } from '@/app/lib/definitions';



interface Props {
  appointments: Appointment[];
}

export default function AppointmentTable({ appointments }: Props) {
console.log(appointments)
  const initialState = { message: undefined, error: undefined };
  const [state, formAction] = useActionState(deleteAppointment, initialState);

  return (
    <div className="appointment-table-container">

      {appointments.length === 0 ? (
        <p className="no-appointments">No appointments available.</p>
      ) : (
        <table className="appointment-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Slot</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((a) => (
              <tr key={a._id}>
                <td>{a._id}</td>
                <td>{a.patientName}</td>
                <td>{a.doctor.name}</td>
                <td>{a.slot}</td>
                <td>
                  <form className="appointment-action-form" action={formAction}>
                    <input type="hidden" name="id" value={a._id} />
                    <button type="submit" className="remove-button">Remove</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {state.error && <p className="status-message error">{state.error}</p>}
    </div>
  );
}
