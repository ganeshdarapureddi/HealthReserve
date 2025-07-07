'use client';

import { useActionState } from 'react';
import { refreshSession } from '@/lib/action';
import NextImage from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import ButtonLink from '@/components/button/ButtonLink';
import Link from 'next/link';

export default function SessionExpired() {
  const router = useRouter();

  const initialState = {success:false, redirectPath:"/", error: '' };

  const [state, dispatch] = useActionState(refreshSession, initialState);

  useEffect(() => {
    if (state?.success) {
      if (state.redirectPath) {
        window.history.replaceState(null, '', state.redirectPath);
      }
      window.location.reload();
    }
  }, [state]);
  

  const searchParams = useSearchParams();
  const from = searchParams.get('from') || '/';
  
  const handleSubmit = async (formData: FormData) => {
    formData.set('redirectPath', from);
    dispatch(formData);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-purple-500 to-red-400 ">
      <form
        action={handleSubmit}
        className="flex flex-col items-center justify-center min-w-[450px] bg-white rounded-2xl space-y-5 shadow-2xl p-10"
      >
        <NextImage
          src="/icons/session-expired.png"
          alt="Session Expired"
          width={100}
          height={100}
        />
        <h1 className="font-bold mt-4 text-2xl">Your Session is Expired !!</h1>
        <p>Please refresh the page to Go Back into the action</p>

        <button className="px-6 py-2 text-white font-semibold rounded-lg bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-center transition" type="submit">Refresh</button>
        <Link
            href="/login"
            className="text-purple-700 font-semibold hover:underline hover:text-purple-900 transition"
          >
            Return to Login
          </Link>

        {'error' in state && state.error && (
          <p className="text-red-600 text-sm">{state.error}</p>
        )}
      </form>
    </div>
  );
}
