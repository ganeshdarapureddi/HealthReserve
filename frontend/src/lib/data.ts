// app/lib/data.ts
"use server";
import { revalidatePath } from "next/cache";
import GetTokenFromCookie from "./cookieStore/getCookie";
import { IDoctor, IUser, IAppointment } from "./models";
import { redirect } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

export async function getDoctors(): Promise<IDoctor[]> {

  let token = await GetTokenFromCookie("token");

  const res = await fetch(`${BASE_URL}/doctors`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "force-cache",
  });


  if (res.status === 401) {
    console.log("Token expired or unauthorized after refresh attempt");
    throw new Error("unauthorized");
  }

  if (!res.ok) {
    throw new Error("Failed to fetch doctors");
  }

  return await res.json();  
}

export async function getUsers(): Promise<IUser[]> {
  const token = await GetTokenFromCookie("token");
  const res = await fetch(`${BASE_URL}/users`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (res.status === 401) {
    console.log("Token expired or unauthorized");
    // redirect(`/expire?from=/dashboard`);
    throw new Error("unauthorized");
  }
  if (!res.ok) throw new Error("Failed to fetch users");
  return await res.json();
}

export async function getAppointments(): Promise<IAppointment[]> {
  const token = await GetTokenFromCookie("token");
  const res = await fetch(`${BASE_URL}/appointments`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (res.status === 401) {
    console.log("Token expired or unauthorized");
    // redirect(`/expire?from=/dashboard`);
    throw new Error("unauthorized");
  }
  // console.log(res);
  if (!res.ok) throw new Error("Failed to fetch appointments");
  return await res.json();
}

export async function getUserById(userId: string | null): Promise<IUser> {
  const token = await GetTokenFromCookie("token");
  console.log("token from the getuser byID",token);
  const res = await fetch(`${BASE_URL}/users/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (res.status === 401) {
    console.log("Token expired or unauthorized");
    // redirect(`/expire?from=/dashboard`);
    throw new Error("unauthorized");
  }
  console.log(res);
  if (!res.ok) throw new Error("Failed to fetch appointments");
  return await res.json();
}

export async function getAppointmentByUserId(
  userId: string | null
): Promise<IAppointment[]> {
  const token = await GetTokenFromCookie("token");
  const res = await fetch(`${BASE_URL}/appointments/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (res.status === 401) {
    console.log("Token expired or unauthorized");
    // redirect(`/expire?from=/dashboard`);
    throw new Error("unauthorized");
  }
  if (!res.ok) {
    throw new Error("Failed to fetch appointments");
  }

  return await res.json();
}

export async function deleteAppointmentApi(
  appointmentId: string
): Promise<Response> {
  const token = await GetTokenFromCookie("token");
  const res = await fetch(`${BASE_URL}/appointments/delete/${appointmentId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (res.status === 401) {
    console.log("Token expired or unauthorized");
    // redirect(`/expire?from=/dashboard`);
    throw new Error("unauthorized");
  }
  return res;
}

export async function UpdateAppointmentStatusApi(
  appointmentId: string,
  status: string
): Promise<Response> {
  const token = await GetTokenFromCookie("token");
  const res = await fetch(`${BASE_URL}/appointments/update/${appointmentId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });
  if (res.status === 401) {
    console.log("Token expired or unauthorized");
    // redirect(`/expire?from=/dashboard`);
    throw new Error("unauthorized");
  }
  revalidatePath("/dashboard/admin");

  return res;
}

export async function getAppointmentByPagination(
  currentPage: number,
  itemsPerPage: number,
  search: string = ""
): Promise<{ data: IAppointment[]; totalPages: number }> {
  const params = new URLSearchParams({
    page: currentPage.toString(),
    limit: itemsPerPage.toString(),
    search: search,
  });

  const token = await GetTokenFromCookie("token");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL!}/appointments/paginated?${params}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (res.status === 401) {
    console.log("Token expired or unauthorized");
    // redirect(`/expire?from=/dashboard`);
    throw new Error("unauthorized");
  }

  if (!res.ok) throw new Error("Failed to fetch");

  return res.json(); // now you return directly parsed JSON
}
