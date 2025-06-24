'use client';

import { useActionState, useEffect, useState } from 'react';
import { deleteAppointment } from '@/app/lib/action';
import { Appointment } from '@/app/lib/definitions';
import NextImage from 'next/image';

interface Props {
  appointments: Appointment[];
}

export default function AppointmentTable({ appointments }: Props) {
  const initialState = { message: undefined, error: undefined };
  const [state, formAction] = useActionState(deleteAppointment, initialState);

  const [input, setInput] = useState("");

  const [debouncedInput, setDebouncedInput] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedInput(input);
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [input]);

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-md">
      {appointments.length === 0 ? (
        <p className="text-center text-lg text-gray-600">No appointments available.</p>
      ) : (
        <div>
          <div>
            <input
              type="text"
              placeholder="Search..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="border bg-white p-2 rounded w-full focus:ring-2  focus:ring-purple-700 focus:outline-none"
            />
          </div>
          <br />

          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-xl">
              <thead>
                <tr className="bg-purple-300 text-purple-800">
                  <th className="px-4 py-3 text-left border-b">ID</th>
                  <th className="px-4 py-3 text-left border-b">Patient</th>
                  <th className="px-4 py-3 text-left border-b">Doctor</th>
                  <th className="px-4 py-3 text-left border-b">Slot</th>
                  <th className="px-4 py-3 text-left border-b">Action</th>
                </tr>
              </thead>
              <tbody>
                {appointments
                  .filter((a) =>
                    a.patientName.toLowerCase().includes(debouncedInput.toLowerCase()) ||
                    a.doctor.name.toLowerCase().includes(debouncedInput.toLowerCase())
                  )
                  .map((a, index) => (
                    <tr
                      key={a._id}
                      className={index % 2 === 0 ? 'bg-white' : 'bg-purple-100 hover:bg-purple-200'}
                    >
                      <td className="px-4 py-3 border-b">{a._id}</td>
                      <td className="px-4 py-3 border-b">{a.patientName}</td>
                      <td className="px-4 py-3 border-b">{a.doctor.name}</td>
                      <td className="px-4 py-3 border-b">{a.slot}</td>
                      <td className="px-4 py-3 border-b">
                        <form action={formAction} className="inline">
                          <input type="hidden" name="id" value={a._id} />
                          <button
                            type="submit"
                            className="shadow-2xl px-3 py-1 rounded flex items-center space-x-2 group"
                          >
                            <div className="transition-transform duration-200 group-hover:scale-125">
                              <NextImage
                                src="/icons/delete-icon.svg"
                                alt="Delete"
                                width={20}
                                height={20}
                              />
                            </div>
                          </button>
                        </form>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {state.error && (
        <p className="text-red-600 text-sm mt-4 text-center">{state.error}</p>
      )}
    </div>
  );
}
