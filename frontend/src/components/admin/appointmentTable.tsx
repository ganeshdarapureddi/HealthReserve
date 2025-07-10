'use client';
import {
  useActionState,
  useEffect,
  useState,
  useTransition,
} from 'react';
import { redirect, useRouter, useSearchParams } from 'next/navigation';
import { deleteAppointment, updateAppointmentStatus } from '@/lib/action';
import { IAppointment } from '@/lib/models';
import NextImage from 'next/image';
import { getAppointmentByPagination } from '@/lib/data';
import Pagination from './paginationButtons';

export default function AppointmentTable() {
  const initialState = { message: undefined, error: undefined };
  const [deleteState, deleteFormAction] = useActionState(deleteAppointment, initialState);
  const [updateState, updateFormAction] = useActionState(updateAppointmentStatus, initialState);

  const [appointments, setAppointments] = useState<IAppointment[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  const [input, setInput] = useState('');
  const [debouncedInput, setDebouncedInput] = useState('');
  const [deletedId, setDeletedId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Get query string values
  const pageParam = parseInt(searchParams.get('page') || '1');
  const limitParam = parseInt(searchParams.get('limit') || '5')
  // const searchParam = searchParams.get('search') || '';

  const [currentPage, setCurrentPage] = useState(pageParam);
  const itemsPerPage = limitParam;


  useEffect(() => {
    const handler = setTimeout(() => setDebouncedInput(input), 800);
    return () => clearTimeout(handler);
  }, [input]);
  

  // Update URL when page or search changes
  useEffect(() => {
    console.log("this is to verify the URL in appointmentTable",process.env.NEXT_PUBLIC_API_BASE_URL)
    const params = new URLSearchParams();
    params.set('page', currentPage.toString());
    params.set('limit', itemsPerPage.toString());
    if (debouncedInput.trim()) params.set('search', debouncedInput.trim());
    router.replace(`?${params.toString()}`);
  }, [currentPage, debouncedInput,itemsPerPage,router]);

  // Fetch data
  useEffect(() => {
    const fetchAppointments = async () => {
      setIsLoading(true);
      try {
        const result = await getAppointmentByPagination(currentPage, itemsPerPage, debouncedInput);
        setAppointments(result.data);
        setTotalPages(result.totalPages);
      } catch (error:any) {
        if (error.message === "unauthorized") {
          redirect(`/expire?from=/dashboard/admin`);
        }
        console.error('Error fetching appointments:', error);
        setAppointments([]);
        setTotalPages(1);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAppointments();
  }, [currentPage, debouncedInput,itemsPerPage]);

  // Remove deleted appointment from local UI
  useEffect(() => {
    if (deleteState.message && deletedId) {
      setAppointments((prev) => prev.filter((a) => a._id !== deletedId));
      setDeletedId(null);
    }
  }, [deleteState, deletedId]);

  const handleStatusChange = (id: string, status: string) => {
    setAppointments((prev) =>
      prev.map((a) => (a._id === id ? { ...a, status } : a))
    );
    const formData = new FormData();
    formData.append('id', id);
    formData.append('status', status);
    startTransition(() => updateFormAction(formData));
  };

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-md">
      <input
        type="text"
        placeholder="Search by patient or doctor..."
        value={input}
        onChange={handleSearchInput}
        className="border bg-white p-2 rounded w-full focus:ring-2 focus:ring-purple-700 focus:outline-none mb-3"
      />

      {isLoading ? (
        <p className="text-center text-gray-600">Loading appointments...</p>
      ) : appointments.length === 0 ? (
        <p className="text-center text-lg text-gray-600">No appointments available.</p>
      ) : (
        <>
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
                {appointments.map((a, index) => (
                  <tr
                    key={a._id}
                    className={index % 2 === 0 ? 'bg-white' : 'bg-purple-100 hover:bg-purple-200'}
                  >
                    <td className="px-4 py-3 border-b">{a._id}</td>
                    <td className="px-4 py-3 border-b">{a.patientName}</td>
                    <td className="px-4 py-3 border-b">Dr. {a.doctor?.name ?? 'Unknown Doctor'}</td>
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
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 border-b">
                      <form
                        action={deleteFormAction}
                        className="inline"
                        onSubmit={() => setDeletedId(a._id)}
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

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        </>
      )}

      {deleteState.error && (
        <p className="text-red-600 text-sm mt-4 text-center">{deleteState.error}</p>
      )}
      {updateState.error && (
        <p className="text-red-600 text-sm mt-2 text-center">{updateState.error}</p>
      )}
    </div>
  );
}
