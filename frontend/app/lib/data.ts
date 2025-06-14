// app/lib/data.ts

import { Doctor, User, Appointment } from "./definitions";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

export async function getDoctors(): Promise<Doctor[]> {
  const res = await fetch(`${BASE_URL}/doctors`,{cache:"no-store"});
  if (!res.ok) throw new Error('Failed to fetch doctors');
  return await res.json();
}

export async function getUsers(): Promise<User[]> {
  const res = await fetch(`${BASE_URL}/users`, );
  if (!res.ok) throw new Error('Failed to fetch users');
  return await res.json();
}

export async function getAppointments(): Promise<Appointment[]> {
  const res = await fetch(`${BASE_URL}/appointments`);
  // console.log(res);
  if (!res.ok) throw new Error('Failed to fetch appointments');
  return await res.json();
}

export async function getUserById(userId:string): Promise<User> {
  const res = await fetch(`${BASE_URL}/users/${userId}`);
  console.log(res);
  if (!res.ok) throw new Error('Failed to fetch appointments');
  return await res.json();
}
