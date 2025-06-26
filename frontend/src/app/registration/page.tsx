'use client';
import { useActionState } from 'react';
import { registerUser, RegisterState } from '@/lib/action';

import Link from 'next/link';

export default function RegisterPage() {
  const initialState: RegisterState = { message: undefined, errors: {} };
  const [state, formAction] = useActionState(registerUser, initialState);

  return (
    <div className='flex flex-col  min-h-screen justify-center items-center bg-cover '
      style={{
        backgroundImage: "url('/register-image.jpg')",

      }}> 
      <form action={formAction} className="bg-purple-100 border-none p-7 space-y-2 rounded-2xl shadow-2xl px-9">
        <h2 className='text-2xl font-bold text-center'>Register</h2>

        <div>
          <label className="font-bold">Name</label><br />
          <input type="text" name="name" className="border-2 border-purple-400 w-80 bg-purple-50 focus:ring-2 focus:ring-purple-700 focus:outline-none p-2 rounded" 
          defaultValue={state.value?.name ?? ""} 
          required />
          {state.errors?.name && <p className='text-red-500'>{state.errors.name[0]}</p>}
        </div>

        <div>
          <label className="font-bold">Email</label><br />
          <input type="email" name="email" className="border-2 border-purple-400 w-80 bg-purple-50 focus:ring-2 focus:ring-purple-700 focus:outline-none p-2 rounded" 
          defaultValue={state.value?.email ?? ""} 
          required />
          {state.errors?.email && <p className='text-red-500'>{state.errors.email[0]}</p>}
        </div>

        <div>
          <label className="font-bold">Phone Number</label><br />
          <input type="tel" name="phone" className="border-2 border-purple-400 w-80 bg-purple-50 focus:ring-2 focus:ring-purple-700 focus:outline-none p-2 rounded"
          defaultValue={state.value?.phone ?? ""} 
          required />
          {state.errors?.phone && <p className='text-red-500'>{state.errors.phone[0]}</p>}
        </div>

        <div>
          <label className="font-bold">Password</label><br />
          <input type="password" name="password" className="border-2 border-purple-400 w-80 bg-purple-50 focus:ring-2 focus:ring-purple-700 focus:outline-none p-2 rounded" 
          defaultValue={state.value?.password ?? ""} 
          required />
          {state.errors?.password && <p className='text-red-500' >{state.errors.password[0]}</p>}
        </div>

        <div>
          <label className="font-bold">Confirm Password</label><br />
          <input type="password" name="confirmPassword" className="border-2 border-purple-400 w-80 bg-purple-50 focus:ring-2 focus:ring-purple-700 focus:outline-none p-2 rounded" 
          defaultValue={state.value?.confirmPassword ?? ""}
          required />
          {state.errors?.confirmPassword && <p className='text-red-500'>{state.errors.confirmPassword[0]}</p>}
        </div>

        <button type="submit" className="block mx-auto border-2 mt-4 border-purple-800 bg-purple-800 px-5 py-1.5 rounded-sm text-white hover:bg-white hover:text-purple-700 transition">Register</button>
        {state.message==="Registration successful!" ? <p className="text-green-600 text-center">{state.message}</p>: <p className="text-red-600 text-center">{state.message}</p>}
        
        {state.errors?.general && <p className="error">{state.errors.general[0]}</p>}

        <div className="text-center mt-4">
          <Link
            href="/login"
            className="text-purple-700 font-semibold hover:underline hover:text-purple-900 transition"
          >
            Return to Login
          </Link>
        </div>
      </form>

    </div>
  );
}
