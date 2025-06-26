'use client'

import { useEffect } from 'react'
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Global error:', error)
  }, [error]) 

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="border-none  p-10 bg-white rounded-4xl shadow-2xl max-w-4xl">
        <h2 className="text-xl text-red-700 font-bold text-center mb-5">Something went wrong globally!</h2>
        <p className="mb-4   text-xl font-serif">{error.message}</p>
        <button onClick={() => reset()} className="block mx-auto px-4 py-2 bg-red-600 text-white text-center rounded-xl  hover:bg-red-700">
          Try again
        </button>
      </div>
    </div>
  )
}
