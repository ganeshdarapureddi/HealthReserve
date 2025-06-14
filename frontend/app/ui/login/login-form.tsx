'use client';

import { useActionState } from 'react';
import { loginUser } from '@/app/lib/action';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import "./login-form.css";
import Link from 'next/link';

const initialState = { message: undefined, errors: {} };

export default function LoginForm() {
  const [state, formAction] = useActionState(loginUser, initialState);
  const router = useRouter();

  useEffect(() => {
    if (state.message === 'Login successful') {
      router.push('/dashboard');
    }
  }, [state,router]);

  return (
    <>
      <form action={formAction} className="login-form-container">
        <h1 className="login-form-title">Login</h1>

        {/* Email */}
        <div>
          <label htmlFor="email" className="login-form-label">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            className="login-form-input"
          />
          {state.errors?.email && (
            <p className="login-form-error">{state.errors.email[0]}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="login-form-label">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            className="login-form-input"
          />
        </div>

        {/* Submit */}
        <div>
          <button type="submit" className="login-form-button">Login</button>
        </div>
        <p className="login-form-footer">
          Dont have an account?{' '}
          <Link href="/registration" className="login-form-link">Register here</Link>
        </p>
      </form>

      {/* Register Link */}

    </>
  );
}
