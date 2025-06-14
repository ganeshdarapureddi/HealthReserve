'use client';

import { useActionState } from 'react';
import { loginUser } from '@/app/lib/action';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import Link from 'next/link';

const initialState = { message: undefined, errors: {} };

export default function LoginForm() {
  const [state, formAction] = useActionState(loginUser, initialState);
  const router = useRouter();

  useEffect(() => {
    if (state.message === 'Login successful') {
      router.push('/dashboard');
    }
  }, [state, router]);

  return (
    <>
      <form action={formAction} className="bg-purple-100 border-none  shadow-2xl rounded-2xl p-10 space-y-6 ">
        <h1 className="text-2xl text-center">Login</h1>

        {/* Email */}
        <div>
          <label htmlFor="email" className="font-bold">Email</label><br />
          <input
            type="email"
            name="email"
            id="email"
            className="border-2 border-purple-400 w-80 bg-purple-50 focus:ring-2 focus:ring-purple-700 focus:outline-none p-2 rounded"
          />
          {state.errors?.email && (
            <p className="text-red-500">{state.errors.email[0]}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="font-bold">Password</label><br />
          <input
            type="password"
            name="password"
            id="password"
            className="border-2 border-purple-400 bg-purple-50 w-80 focus:ring-2 focus:ring-purple-700 focus:outline-none p-2 rounded"
          />
        </div>

        {/* Submit */}
        <div>
          <button type="submit" className="block mx-auto border-2 border-purple-800 bg-purple-800 px-5 py-1.5 rounded-sm text-white hover:bg-white hover:text-purple-700 transition">
            Login
          </button>
        </div>

        {/* Footer */}
        <p className="text-sm text-center text-gray-600">
          Don&apos;t have an account?{' '}
          <Link
            href="/registration"
            className="text-purple-700 font-semibold hover:underline hover:text-purple-900 transition"
          >
            Register here
          </Link>
        </p>
      </form>

    </>
  );
}


