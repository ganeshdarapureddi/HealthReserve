'use server';


export type AppointmentFormData = {
  patientName: string;
  doctorName: string;
  specialization: string;
  slot: string;
};



export type AppointmentState = {
  message?: string;
  errors: Partial<{
    patientName: string[];
    doctorId: string[];
    slot: string[];
  }>;
};

export async function bookAppointment(_: AppointmentState, formData: FormData): Promise<AppointmentState> {
  const patientName = formData.get('patientName')?.toString().trim();
  const doctorId = formData.get('doctorId')?.toString().trim();
  const slot = formData.get('slot')?.toString().trim();

  const errors: AppointmentState['errors'] = {};
  if (!patientName) errors.patientName = ['Patient name is required'];
  if (!doctorId) errors.doctorId = ['Doctor is required'];
  if (!slot) errors.slot = ['Slot is required'];

  if (Object.keys(errors).length > 0) return { errors };

  const userId1 = (await cookies()).get('userId')?.value;
  const userId=validateToken(userId1)
  if (!userId) return { message: 'User not logged in', errors: {} };
  // console.log({ patientName, doctor: doctorId, user: userId, slot })

  console.log("userID:"+userId)
  console.log("userID:"+doctorId)

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ patientName, doctor: doctorId?.toString(), user: userId.toString(), slot:slot }),
    });



    if (!res.ok) {
      const data = await res.json();
      return { message: data.message || 'Failed to book appointment', errors: {} };
    }
    const data = await res.json();
      // console.log('Server response:', data); 


    const slotUpdates = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/doctors/${data.doctor._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        slot: data.slot,          
        status: true,          
      }),
    });
    if (!slotUpdates.ok) {
      const error = await slotUpdates.text();
      console.error('Failed to update slot:', error);
    }

    revalidatePath('/dashboard/admin');
    revalidatePath('/dashboard/appointment/book');
    revalidatePath('/dashboard/appointment');

    redirect('/dashboard/appointment');

}








//for getting data to the appointment dashboard
export async function getUserAppointment(): Promise<Appointment | null> {
  const userId1 = (await cookies()).get('userId')?.value;
  const userId=validateToken(userId1)

  console.log(userId)


  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/appointments/${userId}`);

    if (!res.ok) {
      console.error('Failed to fetch appointment:', res.statusText);
      return null;
    }

    const data = await res.json();
    // console.log("Fetched appointment:", data);

    return data?.[0] || null;

  } catch (error) {
    console.error('Failed to fetch appointment:', error);
    return null;
  }
}




export type RegisterState = {
  message?: string;
  errors?: { [key: string]: string[] };
};

function errorMessageFields(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes('name')) return 'name';
  if (lower.includes('email')) return 'email';
  if (lower.includes('phone')) return 'phone';
  if (lower.includes('password') && lower.includes('confirm')) return 'confirmPassword';
  if (lower.includes('password')) return 'password';
  return 'general';
}

export async function registerUser(
  prevState: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  const name = formData.get('name')?.toString() || '';
  const email = formData.get('email')?.toString() || '';
  const phone = formData.get('phone')?.toString() || '';
  const password = formData.get('password')?.toString() || '';
  const confirmPassword = formData.get('confirmPassword')?.toString() || '';

  const errors: RegisterState['errors'] = {};
  if (!name) errors.name = ['Name is required'];
  if (!email) errors.email = ['Email is required'];
  if (!phone) errors.phone = ['Phone number is required'];
  if (!password) errors.password = ['Password is required'];
  if (password !== confirmPassword) errors.confirmPassword = ['Passwords do not match'];

  if (Object.keys(errors).length > 0) return { errors };

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone, password }),
    });

    if (!res.ok) {
      const data = await res.json();
      const backendErrors: RegisterState['errors'] = {};

      if (Array.isArray(data.message)) {
        for (const msg of data.message) {
          const field = errorMessageFields(msg);
          if (!backendErrors[field]) backendErrors[field] = [];
          backendErrors[field].push(msg);
        }
      } else if (typeof data.message === 'string') {
        console.log(data.message)
        const field = errorMessageFields(data.message);
        backendErrors[field] = [data.message];
      }

      return { message: 'Registration failed', errors: backendErrors };
    }

    return { message: 'Registration successful!', errors: {} };
  } catch {
    return {
      message: 'Server error',
      errors: { general: ['Could not register user'] },
    };
  }
}


import { cookies } from 'next/headers';

type LoginState = {
  message?: string;
  errors?: { email?: string[]; password?: string[] };
};

export async function loginUser(_: LoginState, formData: FormData): Promise<LoginState> {
  const email = formData.get('email')?.toString() || '';
  const password = formData.get('password')?.toString() || '';

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const err = await res.json();
      return {
        message: err.message || 'Invalid credentials',
        errors: { email: ['Invalid email or password'] },
      };
    }

    const { id, role } = await res.json();

    (await cookies()).set('userId', createToken(id), {
      httpOnly: true,
      path: '/',
    });
    (await cookies()).set('userRole', createToken(role), {
      httpOnly: true,
      path: '/',
    });

    return { message: 'Login successful' };
  } catch (error) {
    console.error('Login failed:', error);
    return {
      message: 'Server error',
      errors: { email: ['Something went wrong'] },
    };
  }
}







import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { Appointment } from './definitions';
import { createToken, validateToken } from './auth';




export async function logout() {
  // Deletes the userId cookie
  (await cookies()).delete('userId');
  (await cookies()).delete('userRole');

  // Redirect to login page
  redirect('/login');
}








interface DeleteState {
  message?: string;
  error?: string;
}

export async function deleteAppointment(
  _: DeleteState,
  formData: FormData
): Promise<DeleteState> {
  
  const id = formData.get('id')?.toString();
  if (!id) return { error: 'Invalid ID' };
  console.log("Id of appointment"+id)

  const res=await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/appointments/delete/${id}`,
    {method:"DELETE",
      headers: { 'Content-Type': 'application/json' },
    }
  );

  if (!res.ok) {
    const err = await res.json();
    return {
      message: err.message || 'unable to delete the appointment',
      error:   'unable to delete'
    };
  } 

  const data=await res.json();
  console.log( "Action after deletion:",data);
  console.log("doctorID",data.doctor._id);
  console.log("slots",data.slot)


  const slotUpdates = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/doctors/${data.doctor._id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      slot: data.slot,          
      status: false,          
    }),
  });
  if (!slotUpdates.ok) {
    const error = await slotUpdates.json();
    console.error('Failed to update slot:', error);
  }



  revalidatePath("/dashboard/admin")
  return { message: 'Appointment removed successfully' };

}
