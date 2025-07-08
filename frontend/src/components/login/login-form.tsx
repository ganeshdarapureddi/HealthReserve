'use client';

import { useActionState } from 'react';
import { loginUser } from '@/lib/action';
import { useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { GoogleLogin } from '@react-oauth/google';
import { googleLoginAction } from '@/lib/action';



const initialState = { message: undefined, errors: {} };


export default function LoginForm() {
  const [state, formAction] = useActionState(loginUser, initialState);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  // const [googleError, setGoogleError] = useState<string | null>(null);

  useEffect(() => {
    if (state.message === 'Login successful') {
      router.push('/dashboard');
    }
  }, [state, router]);

  const handleGoogleLogin = async (credentialResponse: any) => {
    // setGoogleError(null);

    const formData = new FormData();
    formData.append('token', credentialResponse.credential);

    startTransition(async () => {
      const result = await googleLoginAction(formData);
      if (result.success) {
        router.push('/dashboard');
      }
      // } else {
      //   setGoogleError(result.message);
      // }
    });
  };

  return (
    <form action={formAction} className="bg-purple-100 shadow-2xl rounded-2xl p-10 space-y-6">
      <h1 className="text-2xl text-center">Login</h1>

      {/* Email */}
      <div>
        <label htmlFor="email" className="font-bold">Email</label><br />
        <input
          type="email"
          name="email"
          id="email"
          defaultValue={state.value?.email ?? ""}
          className="border-2 border-purple-400 w-80 text-gray-800  bg-purple-50 focus:ring-2 focus:ring-purple-700 focus:outline-none p-2 rounded"
        />
      </div>

      {/* Password */}
      <div>
        <label htmlFor="password" className="font-bold">Password</label><br />
        <input
          type="password"
          name="password"
          id="password"
          defaultValue={state.value?.password ?? ""}
          className="border-2 border-purple-400 text-gray-800 bg-purple-50 w-80 focus:ring-2 focus:ring-purple-700 focus:outline-none p-2 rounded"
        />
      </div>

      {/* Submit */}
      <div>
        <button
          type="submit"
          className="block mx-auto border-2 border-purple-800 bg-purple-800 px-5 py-1.5 rounded-sm text-white hover:bg-white hover:text-purple-700 transition"
        >
          Login
        </button>
      </div>

      <div className="text-center text-gray-500 font-semibold">OR</div>

      {/* Google Login */}
      <div className="flex flex-col items-center space-y-3">
        <GoogleLogin
          onSuccess={handleGoogleLogin}
          // onError={() => setGoogleError('Google login failed')}
          useOneTap
          use_fedcm_for_prompt={false}
        />

        {isPending && <p className="text-sm text-purple-700">Signing in with Google...</p>}
        
      </div>

      {state.errors?.overall && (
        <p className="text-red-500 text-center">{state.errors.overall}</p>
      )}

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
  );
} 
