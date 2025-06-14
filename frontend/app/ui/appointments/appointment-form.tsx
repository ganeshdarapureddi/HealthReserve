'use client';

import { useActionState, useState } from 'react';
import { bookAppointment, AppointmentState } from '@/app/lib/action';
import './appointment-form.css';

interface AppointmentFormProps {
  doctors: {
    _id: string;
    name: string;
    specialization: string;
    slots: { time: string; booked: boolean }[];
  }[];
}

export default function AppointmentForm({ doctors }: AppointmentFormProps) {
  const initialState: AppointmentState = { message: undefined, errors: {} };
  const [state, formAction] = useActionState(bookAppointment, initialState);
  const [selectedDoctor, setSelectedDoctor] = useState(doctors[0]);
  const [selectedSlot, setSelectedSlot] = useState(
    doctors[0].slots.find((s) => !s.booked) || doctors[0].slots[0]
  );

  const handleDoctorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const doctor = doctors.find((doc) => doc._id === e.target.value);
    if (doctor) {
      setSelectedDoctor(doctor);
      setSelectedSlot(doctor.slots.find((s) => !s.booked) || doctor.slots[0]);
    }
  };

  const handleSlotChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const slot = selectedDoctor.slots.find((s) => s.time === e.target.value);
    if (slot) setSelectedSlot(slot);
  };

  return (
    <form action={formAction} className="appointment-form">
      <div className="appointment-fields">
        {/* Patient Name */}
        <div>
          <label htmlFor="patientName" className="appointment-label">Patient Name</label>
          <input type="text" name="patientName" id="patientName" className="appointment-input1" />
          {state.errors?.patientName && (
            <p className="appointment-error">{state.errors.patientName[0]}</p>
          )}
        </div>

        {/* Doctor */}
        <div>
          <label htmlFor="doctorId" className="appointment-label">Select Doctor</label>
          <select
            name="doctorId"
            id="doctorId"
            className="appointment-input"
            onChange={handleDoctorChange}
            value={selectedDoctor._id}
          >
            {doctors.map((doctor) => (
              <option key={doctor._id} value={doctor._id}>
                {doctor.name} — {doctor.specialization}
              </option>
            ))}
          </select>
          {state.errors?.doctorId && (
            <p className="appointment-error">{state.errors.doctorId[0]}</p>
          )}
        </div>

        {/* Slot */}
        <div>
          <label htmlFor="slot" className="appointment-label">Select Slot</label>
          <select
            name="slot"
            id="slot"
            className="appointment-input"
            onChange={handleSlotChange}
            value={selectedSlot?.time}
          >
            {selectedDoctor.slots.map((slot) => (
              <option key={slot.time} value={slot.time} disabled={slot.booked}>
                {slot.time} {slot.booked ? ' (Booked)' : ''}
              </option>
            ))}
          </select>
          {state.errors?.slot && <p className="appointment-error">{state.errors.slot[0]}</p>}
        </div>
      </div>

      <div className="appointment-submit">
        <button type="submit">Book Appointment</button>
      </div>

      {state.message && <p className="appointment-success">{state.message}</p>}
    </form>
  );
}
