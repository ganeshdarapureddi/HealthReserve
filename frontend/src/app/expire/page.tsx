'use client';

import { useActionState } from 'react';
import { refreshSession } from '@/lib/action';
import NextImage from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

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
        <p>Please refresh the page to login again.</p>

        <button type="submit">Refresh</button>

        {'error' in state && state.error && (
          <p className="text-red-600 text-sm">{state.error}</p>
        )}
      </form>
    </div>
  );
}
