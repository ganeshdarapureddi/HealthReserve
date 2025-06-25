// app/lib/data.ts

import GetTokenFromCookie from "./cookieStore/getCookie";
import { Doctor, User, Appointment } from "./definitions";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

export async function getDoctors(): Promise<Doctor[]> {
  const token=await GetTokenFromCookie("token");
  console.log("token::::",token)
  const res = await fetch(`${BASE_URL}/doctors`,{
    method: "GET", // or "POST", "PUT", etc.
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
      
    },
    cache: 'force-cache', 
  }
  );
  if (!res.ok) throw new Error('Failed to fetch doctors');  
  return await res.json();
}

export async function getUsers(): Promise<User[]> {
  const token=await GetTokenFromCookie("token");
  const res = await fetch(`${BASE_URL}/users`,{
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  }
  );
  if (!res.ok) throw new Error('Failed to fetch users');
  return await res.json();
}

export async function getAppointments(): Promise<Appointment[]> {
  const token=await GetTokenFromCookie("token");
  const res = await fetch(`${BASE_URL}/appointments`,{
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  }
  );
  // console.log(res);
  if (!res.ok) throw new Error('Failed to fetch appointments');
  return await res.json();
}

export async function getUserById(userId:string|null): Promise<User> {
  const token=await GetTokenFromCookie("token");
  const res = await fetch(`${BASE_URL}/users/${userId}`,{
    method: "GET", 
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  }
  );
  console.log(res);
  if (!res.ok) throw new Error('Failed to fetch appointments');
  return await res.json();
}


export async function getAppointmentByUserId(userId:string|null): Promise<Response> {
  const token=await GetTokenFromCookie("token");
  const res = await fetch(`${BASE_URL}/appointments/${userId}`,{
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  }
  );
  return res
}





export async function deleteAppointmentApi(appointmentId:string): Promise<Response> {
  const token=await GetTokenFromCookie("token");
  const res = await fetch(`${BASE_URL}/appointments/delete/${appointmentId}`,{
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  }
  );
  return res;
}



