'use client';

import { useState, useEffect, useRef } from 'react';
import { useActionState } from 'react';
import { updateDoctor, DoctorUpdateState } from '@/lib/action';
import { DEFAULT_SLOTS } from '@/components/admin/doctors/createDoctorForm';
import { IDoctor } from '@/lib/models';

interface Props {
  doctors: IDoctor[];
}

export default function UpdateDoctorForm({ doctors }: Props) {
  const initialState: DoctorUpdateState = {
    message: undefined,
    errors: {},
    values: {
      id: '',
      experience: '',
      slots: [],
    },
  };

  const [state, formAction] = useActionState(updateDoctor, initialState);
  const [selectedDoctor, setSelectedDoctor] = useState<IDoctor | null>(null);
  const [experience, setExperience] = useState('');
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);

  const formRef = useRef<HTMLFormElement>(null);

  const handleDoctorSelect = (doctor: IDoctor) => {
    setSelectedDoctor(doctor);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 0);
  };

  useEffect(() => {
    if (selectedDoctor) {
      setExperience(
        (state.values?.id === selectedDoctor._id && state.values.experience) ||
        selectedDoctor.experience.toString()
      );
      setSelectedSlots(
        (state.values?.id === selectedDoctor._id && state.values.slots) ||
        selectedDoctor.slots.map((s) => s.time)
      );
    }
  }, [selectedDoctor, state.values]);


  return (
    <div>
      {/* Doctor Cards */}
      <div className="flex flex-wrap gap-6">
        {doctors.map((doctor) => (
          <div
            key={doctor._id}
            onClick={() => handleDoctorSelect(doctor)}
            className="bg-white min-w-[300px] p-4 rounded-lg shadow-md cursor-pointer hover:shadow-lg hover:bg-purple-900 border border-purple-200 group transition"
          >
            <div>
              <h3 className="text-xl font-semibold group-hover:text-white transition">
                {doctor.name}
              </h3>
              <p className="text-gray-600 group-hover:text-white transition">
                {doctor.specialization}
              </p>
              <p className="text-sm text-gray-500 group-hover:text-white transition">
                Experience: {doctor.experience} years
              </p>
            </div>
          </div>
        ))}
      </div>


      {/* Update Form */}
      {selectedDoctor && (
        <form
          action={formAction}
          ref={formRef}
          className="mt-10 bg-gray-50 p-6 rounded-xl shadow-xl max-w-3xl mx-auto"
        >
          <input type="hidden" name="id" value={selectedDoctor._id} />
          <input type="hidden" name="experience" value={experience} />
          {selectedSlots.map((slot) => (
            <input key={slot} type="hidden" name="slots" value={slot} />
          ))}

          <h2 className="text-xl font-semibold mb-4 text-purple-700">
            Update Doctor: {selectedDoctor.name}
          </h2>

          {/* Experience (controlled) */}
          <div className="mb-4">
            <label className="block font-medium mb-1 text-gray-700">Experience (years)</label>
            <input
              type="number"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            {state.errors?.experience && (
              <p className="text-red-500 text-sm mt-1">{state.errors.experience[0]}</p>
            )}
          </div>

          {/* Slots (controlled) */}
          <div className="mb-4">
            <label className="block font-medium mb-2 text-gray-700">Select Available Slots</label>
            <div className="grid grid-cols-2 gap-3">
              {DEFAULT_SLOTS.map((slot) => (
                <label key={slot} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value={slot}
                    checked={selectedSlots.includes(slot)}
                    onChange={(e) => {
                      setSelectedSlots((prev) =>
                        e.target.checked
                          ? [...prev, slot]
                          : prev.filter((s) => s !== slot)
                      );
                    }}
                    className="form-checkbox text-purple-600 w-5 h-5"
                  />
                  <span>{slot}</span>
                </label>
              ))}
            </div>
            {state.errors?.slots && (
              <p className="text-red-500 text-sm mt-1">{state.errors.slots[0]}</p>
            )}
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Update Doctor
            </button>
          </div>

          {/* Feedback */}
          {state.message && (
            <p
              className={`mt-4 text-center font-medium ${state.message === 'Failed to update doctor'
                ? 'text-red-600'
                : 'text-green-600'
                }`}
            >
              {state.message}
            </p>
          )}
        </form>
      )}
    </div>
  );
}
