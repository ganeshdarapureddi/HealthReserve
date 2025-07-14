'use client';

import { useActionState, useState, useEffect } from 'react';
import { bookAppointment, AppointmentState } from '@/lib/action';

interface AppointmentFormProps {
  token:string|undefined;
  doctors: {
    _id: string;
    name: string;
    specialization: string;
  }[];
}

export default function AppointmentForm({ doctors,token }: AppointmentFormProps) {
  const initialState: AppointmentState = { message: undefined, errors: {} };
  const [state, formAction] = useActionState(bookAppointment, initialState);
  const [selectedDoctor, setSelectedDoctor] = useState(doctors[0]);
  const [selectedSlot, setSelectedSlot] = useState<{ time: string } | null>(null);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [slots, setSlots] = useState<{ time: string; booked: boolean }[]>([]);

  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + +1);
    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const dd = String(tomorrow.getDate()).padStart(2, '0');
    const formatted = `${yyyy}-${mm}-${dd}`; // ISO format for backend
    setAppointmentDate(formatted);
  }, []);

  // Fetch available slots when doctor or date changes
  useEffect(() => {
    if (!selectedDoctor || !appointmentDate) return;
    const fetchSlots = async () => {
      
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL!}/doctors/${selectedDoctor._id}/slots?date=${appointmentDate}`,
          {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
        );
        if (res.status === 401) {
          console.log("Token expired or unauthorized");
          throw new Error("unauthorized");
        }

        if (!res.ok) throw new Error('Failed to fetch slots');
        const data = await res.json();
        setSlots(data);
        setSelectedSlot(data.find((s: any) => !s.booked) || null);
      } catch (err) {
        console.error('Error fetching slots:', err);
      }
    };
  
    fetchSlots();
  }, [selectedDoctor, appointmentDate]);
  

  const handleDoctorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const doctor = doctors.find((doc) => doc._id === e.target.value);
    if (doctor) setSelectedDoctor(doctor);
  };

  const handleSlotChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const slot = slots.find((s) => s.time === e.target.value);
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
            placeholder="Patient Name"
            name="patientName"
            id="patientName"
            className="w-full px-3 py-2 border border-gray-300 bg-white rounded-md"
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
            className="w-full px-3 py-2 border border-gray-300 bg-white rounded-md"
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

        {/* Appointment Date */}
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
            className="w-full px-3 py-2 border border-gray-300 bg-gray-100 rounded-md"
          />
        </div>

        {/* Slot Selection */}
        <div>
          <label htmlFor="slot" className="block text-md font-semibold text-gray-700 mb-1">
            Select Slot
          </label>
          <select
            name="slot"
            id="slot"
            className="w-full px-3 py-2 border border-gray-300 bg-white rounded-md"
            onChange={handleSlotChange}
            value={selectedSlot?.time || ''}
          >
            {slots.map((slot) => (
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
          className="px-6 py-3 text-white font-semibold rounded-lg bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 transition"
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
