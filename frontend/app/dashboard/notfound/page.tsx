export default function NotFound() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen text-center font-sans px-4">
      <h1 className="text-2xl text-red-700 font-semibold mb-2">No access to this page</h1>
      <p className="text-gray-600 text-base">
        You might not have the required permissions or the page doesn't exist.
      </p>
    </div>
  );
}

  