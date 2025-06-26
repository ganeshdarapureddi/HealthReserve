'use client';

import { useActionState, useState, useEffect } from 'react';
import { bookAppointment, AppointmentState } from '@/app/lib/action';

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

  const [appointmentDate, setAppointmentDate] = useState('');

  useEffect(() => {
    const tomorrow = new Date();
    console.log("Date of today",tomorrow)
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const dd = String(tomorrow.getDate()).padStart(2, '0');
    setAppointmentDate(`${dd}-${mm}-${yyyy}`);
  }, []);

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
    <form
      action={formAction}
      className="bg-purple-50 p-10 rounded-xl shadow-xl max-w-3xl mx-auto my-12 font-sans"
    >
      <div className="flex flex-col gap-5">
        {/* Patient Name */}
        <div>
          <label htmlFor="patientName" className="block text-md font-semibold text-gray-700 mb-1">
            Patient Name
          </label>
          <input
            type="text"
            placeholder='Patient Name'
            name="patientName"
            id="patientName"
            className="w-full px-3 py-2 border border-gray-300 bg-white rounded-md text-base focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          {state.errors?.patientName && (
            <p className="text-red-500 text-sm mt-1">{state.errors.patientName[0]}</p>
          )}
        </div>

        {/* Doctor */}
        <div>
          <label htmlFor="doctorId" className="block text-md font-semibold text-gray-700 mb-1">
            Select Doctor
          </label>
          <select
            name="doctorId"
            id="doctorId"
            className="w-full px-3 py-2 border border-gray-300 bg-white rounded-md text-base font-serif focus:outline-none focus:ring-2 focus:ring-purple-400"
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
            <p className="text-red-500 text-sm mt-1">{state.errors.doctorId[0]}</p>
          )}
        </div>

        {/* Date - read-only */}
        <div>
          <label htmlFor="date" className="block text-md font-semibold text-gray-700 mb-1">
            Appointment Date
          </label>
          <input
            type="text"
            id="date"
            name="date"
            value={appointmentDate}
            readOnly
            className="w-full px-3 py-2 border border-gray-300 bg-gray-100 rounded-md text-base focus:outline-none"
          />
        </div>

        {/* Slot */}
        <div>
          <label htmlFor="slot" className="block text-md font-semibold text-gray-700 mb-1">
            Select Slot
          </label>
          <select
            name="slot"
            id="slot"
            className="w-full px-3 py-2 border border-gray-300 bg-white rounded-md text-base focus:outline-none focus:ring-2 focus:ring-purple-400"
            onChange={handleSlotChange}
            value={selectedSlot?.time}
          >
            {selectedDoctor.slots.map((slot) => (
              <option key={slot.time} value={slot.time} disabled={slot.booked}>
                {slot.time} {slot.booked ? '(Booked)' : ''}
              </option>
            ))}
          </select>
          {state.errors?.slot && (
            <p className="text-red-500 text-sm mt-1">{state.errors.slot[0]}</p>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end mt-8">
        <button
          type="submit"
          className="px-6 py-3 text-white font-semibold rounded-lg bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-center transition"
        >
          Book Appointment
        </button>
      </div>

      {/* Success Message */}
      {state.message && (
        <p className="text-green-600 mt-4 text-center font-medium">{state.message}</p>
      )}
    </form>
  );
}
