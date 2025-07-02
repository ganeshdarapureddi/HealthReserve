'use client';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  setCurrentPage,
}: PaginationProps) {
  const buttons = [];

  for (let i = 1; i <= totalPages; i++) {
    buttons.push(
      <button
        key={i}
        onClick={() => setCurrentPage(i)}
        className={`px-3 py-1 rounded ${
          currentPage === i ? 'bg-purple-600 text-white' : 'bg-purple-100'
        }`}
      >
        {i}
      </button>
    );
  }

  return (
    <div className="flex justify-between space-x-2 mt-4">
      <button
        onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        className="px-3 py-1 bg-purple-200 rounded disabled:opacity-50"
      >
        Prev
      </button>

      <div className="flex gap-2">{buttons}</div>

      <button
        onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="px-3 py-1 bg-purple-200 rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}
