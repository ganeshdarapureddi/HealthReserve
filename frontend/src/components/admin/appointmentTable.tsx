'use client';

import {
  useActionState,
  useEffect,
  useState,
  useTransition,
} from 'react';
import { deleteAppointment, updateAppointmentStatus } from '@/lib/action';
import { IAppointment } from '@/lib/models';
import NextImage from 'next/image';

interface Props {
  appointments: IAppointment[];
}

export default function AppointmentTable({ appointments }: Props) {
  const initialState = { message: undefined, error: undefined };

  const [deleteState, deleteFormAction] = useActionState(deleteAppointment, initialState);
  const [updateState, updateFormAction] = useActionState(updateAppointmentStatus, initialState);

  const [input, setInput] = useState('');
  const [debouncedInput, setDebouncedInput] = useState('');
  const [deletedId, setDeletedId] = useState<string | null>(null);

  const [localAppointments, setLocalAppointments] = useState<IAppointment[]>(
    [...appointments].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  );

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedInput(input);
    }, 1000);
    return () => clearTimeout(handler);
  }, [input]);

  useEffect(() => {
    if (deleteState.message && deletedId) {
      setLocalAppointments((prev) => prev.filter((a) => a._id !== deletedId));
      setDeletedId(null);
    }
  }, [deleteState, deletedId]);

  const handleStatusChange = (id: string, status: string) => {
    setLocalAppointments((prev) =>
      prev.map((a) => (a._id === id ? { ...a, status } : a))
    );
    const formData = new FormData();
    formData.append('id', id);
    formData.append('status', status);

    startTransition(() => {
      updateFormAction(formData);
    });
  };

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-md">
      {localAppointments.length === 0 ? (
        <p className="text-center text-lg text-gray-600">No appointments available.</p>
      ) : (
        <div>
          <input
            type="text"
            placeholder="Search..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="border bg-white p-2 rounded w-full focus:ring-2 focus:ring-purple-700 focus:outline-none mb-3"
          />

          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-xl">
              <thead>
                <tr className="bg-purple-300 text-purple-800">
                  <th className="px-4 py-3 text-left border-b">ID</th>
                  <th className="px-4 py-3 text-left border-b">Patient</th>
                  <th className="px-4 py-3 text-left border-b">Doctor</th>
                  <th className="px-4 py-3 text-left border-b">Date</th>
                  <th className="px-4 py-3 text-left border-b">Slot</th>
                  <th className="px-4 py-3 text-left border-b">Status</th>
                  <th className="px-4 py-3 text-left border-b">Action</th>
                </tr>
              </thead>
              <tbody>
                {localAppointments
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
                      <td className="px-4 py-3 border-b">{a.date}</td>
                      <td className="px-4 py-3 border-b">{a.slot}</td>
                      <td className="px-4 py-3 border-b">
                        <select
                          name="status"
                          value={a.status}
                          onChange={(e) => handleStatusChange(a._id, e.target.value)}
                          className="border p-1 rounded text-sm bg-white"
                          disabled={isPending || a.status === 'completed'}
                        >
                          <option value="pending">Pending</option>
                          <option value="completed">Completed</option>
                        </select>
                      </td>
                      <td className="px-4 py-3 border-b">
                        <form
                          action={(formData) => {
                            setDeletedId(a._id);
                            deleteFormAction(formData);
                          }}
                          className="inline"
                        >
                          <input type="hidden" name="id" value={a._id} />
                          <button
                            type="submit"
                            className="shadow-2xl px-3 py-1 rounded flex items-center space-x-2 group"
                          >
                            <div className="transition-transform duration-300 group-hover:scale-125">
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

      {deleteState.error && (
        <p className="text-red-600 text-sm mt-4 text-center">{deleteState.error}</p>
      )}
      {updateState.error && (
        <p className="text-red-600 text-sm mt-2 text-center">{updateState.error}</p>
      )}
      {updateState.message && (
        <p className="text-green-600 text-sm mt-2 text-center">{updateState.message}</p>
      )}
    </div>
  );
}
