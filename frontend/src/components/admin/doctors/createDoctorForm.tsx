'use client';

import { useActionState } from 'react';
import { createDoctor, DoctorState } from '@/lib/action';
import { redirect } from 'next/navigation';

export const DEFAULT_SLOTS = [
  '10:00 AM - 10:30 AM',
  '10:30 AM - 11:00 AM',
  '11:00 AM - 11:30 AM',
  '11:30 AM - 12:00 PM',
  '12:00 PM - 12:30 PM',
  '12:30 PM - 01:00 PM',
  '01:00 PM - 01:30 PM',
  '01:30 PM - 02:00 PM',
  '02:00 PM - 02:30 PM',
  '02:30 PM - 03:00 PM',
  '03:00 PM - 03:30 PM',
  '03:30 PM - 04:00 PM',
  '04:00 PM - 04:30 PM',
  '04:30 PM - 05:00 PM',
  '05:00 PM - 05:30 PM',
  '05:30 PM - 06:00 PM',
  '06:00 PM - 06:30 PM',
  '06:30 PM - 07:00 PM',
  '07:00 PM - 07:30 PM',
  '07:30 PM - 08:00 PM',
  '08:00 PM - 08:30 PM',
  '08:30 PM - 09:00 PM',
];

export default function CreateDoctorForm() {
  try {

    const initialState: DoctorState = { message: undefined, errors: {} };
    const [state, formAction] = useActionState(createDoctor, initialState);

    return (
      <form
        action={formAction}
        className="bg-purple-50 p-10 rounded-lg shadow-lg max-w-3xl mx-auto mt-10 space-y-6"
      >
        <h2 className="text-2xl font-bold text-center text-purple-700">Create Doctor</h2>

        {/* Name */}
        <div>
          <label htmlFor="name" className="block font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            name="name"
            id="name"
            type="text"
            defaultValue={state.values?.name || ''}
            placeholder="Doctor Name"
            className="w-full border bg-white px-3 py-2 rounded-md focus:ring-2 focus:ring-purple-700 focus:outline-none mb-3"
          />
          {state.errors?.name && (
            <p className="text-sm text-red-600 mt-1">{state.errors.name[0]}</p>
          )}
        </div>

        {/* Specialization */}
        <div>
          <label htmlFor="specialization" className="block font-medium text-gray-700 mb-1">
            Specialization
          </label>
          <input
            name="specialization"
            id="specialization"
            type="text"
            defaultValue={state.values?.specialization || ''}
            placeholder="e.g., Cardiology"
            className="w-full border bg-white px-3 py-2 rounded-md focus:ring-2 focus:ring-purple-700 focus:outline-none mb-3"
          />
          {state.errors?.specialization && (
            <p className="text-sm text-red-600 mt-1">{state.errors.specialization[0]}</p>
          )}
        </div>

        {/* Experience */}
        <div>
          <label htmlFor="experience" className="block font-medium text-gray-700 mb-1">
            Experience (in years)
          </label>
          <input
            name="experience"
            id="experience"
            type="number"
            defaultValue={state.values?.experience || ''}
            min={0}
            className="w-full border bg-white px-3 py-2 rounded-md focus:ring-2 focus:ring-purple-700 focus:outline-none mb-3"
          />
          {state.errors?.experience && (
            <p className="text-sm text-red-600 mt-1">{state.errors.experience[0]}</p>
          )}
        </div>

        {/* Time Slots */}
        <div>
          <label className="block font-medium text-gray-700 mb-2">
            Available Slots
          </label>
          <div className="grid grid-cols-2 gap-3">
            {DEFAULT_SLOTS.map((slot) => (
              <label key={slot} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="slots"
                  defaultChecked={state.values?.slots?.includes(slot)}
                  value={slot}
                  className="form-checkbox text-purple-600 w-5 h-5" 
                />
                <span>{slot}</span>
              </label>
            ))}
          </div>

          {state.errors?.slots && (
            <p className="text-sm text-red-600 mt-2">{state.errors.slots[0]}</p>
          )}
        </div>

        {/* Submit */}
        <div className="text-right">
          <button
            type="submit"
            className="px-6 py-3 text-white font-semibold rounded-lg bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-center transition"
          >
            Create Doctor
          </button>
        </div>

        {state.message && (
          <p
            className={`mt-4 text-center font-medium ${state.message === 'Doctor created successfully!' ? 'text-green-600' : 'text-red-600'
              }`}
          >
            {state.message}
          </p>
        )}
      </form>
    );
  }
  catch (err: any) {
    if (err.message === "unauthorized") {
      redirect(`/expire?from=/dashboard/manage-appointment/create`);
    }
    throw err;
  }
}
