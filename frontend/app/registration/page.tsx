'use client';

import { useActionState } from 'react';
import { registerUser, RegisterState } from '@/app/lib/action';
import './registration.css';

export default function RegisterPage() {
  const initialState: RegisterState = { message: undefined, errors: {} };
  const [state, formAction] = useActionState(registerUser, initialState);

  return (
    <div>
      <form action={formAction} className="register-form">
        <h2>Register</h2>

        <div>
          <label>Name</label>
          <input type="text" name="name" required />
          {state.errors?.name && <p>{state.errors.name[0]}</p>}
        </div>

        <div>
          <label>Email</label>
          <input type="email" name="email" required />
          {state.errors?.email && <p>{state.errors.email[0]}</p>}
        </div>

        <div>
          <label>Phone Number</label>
          <input type="tel" name="phone" required />
          {state.errors?.phone && <p>{state.errors.phone[0]}</p>}
        </div>

        <div>
          <label>Password</label>
          <input type="password" name="password" required />
          {state.errors?.password && <p>{state.errors.password[0]}</p>}
        </div>

        <div>
          <label>Confirm Password</label>
          <input type="password" name="confirmPassword" required />
          {state.errors?.confirmPassword && <p>{state.errors.confirmPassword[0]}</p>}
        </div>

        <button type="submit">Register</button>
        {state.message && <p className="success">{state.message}</p>}
        {state.errors?.general && <p className="error">{state.errors.general[0]}</p>}
      </form>

      <p className="register-form-footer">
        <a href="/login" className="register-form-link">
          Return to login
        </a>
      </p>
    </div>
  );
}
