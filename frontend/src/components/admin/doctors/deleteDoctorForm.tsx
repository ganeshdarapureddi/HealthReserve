'use client';

import { useActionState } from 'react';
import { useState } from 'react';
import { deleteDoctor, DeleteDoctorState } from '@/lib/action';
import { IDoctor } from '@/lib/models';

interface Props {
  doctors: IDoctor[];
}

export default function DeleteDoctorForm({ doctors }: Props) {
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);
  const initialState: DeleteDoctorState = { message: undefined, errors: {} };
  const [state, formAction] = useActionState(deleteDoctor, initialState);


  return (
    <div className="flex flex-col gap-6">
      {/* Doctor Cards */}
      <div className="flex flex-wrap gap-6">
        {doctors.map((doctor) => (
          <div
            key={doctor._id}
            onClick={() => setSelectedDoctorId(doctor._id)}
            className={`min-w-[250px] p-4 rounded-lg shadow-md border-none cursor-pointer transition 
              ${selectedDoctorId === doctor._id ? 'ring-2 ring-purple-900 ring-offset-2 ring-offset-white '  : ''} 
              hover:shadow-lg hover:bg-purple-100`}
          >
            <h3 className="text-xl font-semibold">{doctor.name}</h3>
            <p className="text-gray-600">{doctor.specialization}</p>
            <p className="text-sm text-gray-500">Experience: {doctor.experience} years</p>
          </div>
        ))}
      </div>

      {/* Delete Form */}
      {selectedDoctorId && (
        <form action={formAction} className="max-w-md mx-auto bg-red-50 p-6 rounded-lg shadow-md mt-6">
          <input type="hidden" name="id" value={selectedDoctorId} />
        
          <button
            type="submit"
            className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 w-full"
          >
            Delete Selected Doctor
          </button>

          {state.message && (
            <p className={`mt-4 text-center font-medium ${state.message.includes('Failed') ? 'text-red-600' : 'text-green-600'}`}>
              {state.message}
            </p>
          )}
        </form>
      )}
    </div>
  );
}
