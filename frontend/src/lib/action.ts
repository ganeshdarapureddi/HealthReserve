"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { IAppointment } from "./models";
import { Encrypt, Decrypt } from "./auth";
import {
  deleteAppointmentApi,
  getAppointmentByUserId,
  UpdateAppointmentStatusApi,
} from "./data";
import GetTokenFromCookie, { GetCookie } from "./cookieStore/getCookie";
import { z } from "zod";

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

export async function bookAppointment(
  _: AppointmentState,
  formData: FormData
): Promise<AppointmentState> {
  const patientName = formData.get("patientName")?.toString().trim();
  const doctorId = formData.get("doctorId")?.toString().trim();
  const date = formData.get("date")?.toString().trim();
  const slot = formData.get("slot")?.toString().trim();

  const errors: AppointmentState["errors"] = {};
  if (!patientName) errors.patientName = ["Patient name is required"];
  if (!doctorId) errors.doctorId = ["Doctor is required"];
  if (!slot) errors.slot = ["Slot is required"];

  if (Object.keys(errors).length > 0) return { errors };

  const userId1 = (await cookies()).get("userId")?.value;
  const userId = Decrypt(userId1);
  if (!userId) return { message: "User not logged in", errors: {} };
  // console.log({ patientName, doctor: doctorId, user: userId, slot })

  console.log("userID:" + userId);
  console.log("userID:" + doctorId);
  const token = await GetTokenFromCookie("token");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/appointments`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        patientName,
        doctor: doctorId?.toString(),
        user: userId.toString(),
        date: date,
        slot: slot,
      }),
    }
  );

  if (res.status === 401) {
    console.log("Token expired or unauthorized");
    redirect("/api/logout");
  }

  if (!res.ok) {
    const data = await res.json();
    return {
      message: data.message || "Failed to book appointment",
      errors: {},
    };
  }
  const data = await res.json();
  // console.log('Server response:', data);

  const slotUpdates = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/doctors/${data.doctor._id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        slot: data.slot,
        status: true,
      }),
    }
  );

  if (!slotUpdates.ok) {
    const error = await slotUpdates.text();
    console.error("Failed to update slot:", error);
  }

  revalidatePath("/dashboard/admin");
  revalidatePath("/dashboard/appointment/book");
  revalidatePath("/dashboard/appointment");
  redirect("/dashboard/appointment");
}

//for getting data to the appointment dashboard
export async function getUserAppointment(): Promise<IAppointment[] | null> {
  try {
    const userId = await GetCookie("userId");
    const data = await getAppointmentByUserId(userId);

    // console.log("Fetched appointment:", data);

    return data || null;
  } catch (error: any) {
    throw error;
  }
}

export type RegisterState = {
  message?: string;
  errors?: { [key: string]: string[] };
  value?: {
    name?: string;
    email?: string;
    phone?: string;
    password?: string;
    confirmPassword?: string;
  };
  success?: boolean;
};

function errorMessageFields(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("name")) return "name";
  if (lower.includes("email")) return "email";
  if (lower.includes("phone")) return "phone";
  if (lower.includes("password") && lower.includes("confirm"))
    return "confirmPassword";
  if (lower.includes("password")) return "password";
  return "general";
}

export async function registerUser(
  prevState: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  const name = formData.get("name")?.toString() || "";
  const email = formData.get("email")?.toString() || "";
  const phone = formData.get("phone")?.toString() || "";
  const password = formData.get("password")?.toString() || "";
  const confirmPassword = formData.get("confirmPassword")?.toString() || "";

  const errors: RegisterState["errors"] = {};
  if (!name) errors.name = ["Name is required"];
  if (!email) errors.email = ["Email is required"];
  if (!phone) errors.phone = ["Phone number is required"];
  if (!password) errors.password = ["Password is required"];
  if (password !== confirmPassword)
    errors.confirmPassword = ["Passwords do not match"];

  const formValues = { name, email, phone, password, confirmPassword };

  if (Object.keys(errors).length > 0) {
    return { errors, value: formValues };
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, phone, password }),
      }
    );

    if (!res.ok) {
      const data = await res.json();
      const backendErrors: RegisterState["errors"] = {};

      if (Array.isArray(data.message)) {
        for (const msg of data.message) {
          const field = errorMessageFields(msg);
          if (!backendErrors[field]) backendErrors[field] = [];
          backendErrors[field].push(msg);
        }
      } else if (typeof data.message === "string") {
        const field = errorMessageFields(data.message);
        backendErrors[field] = [data.message];
      }

      return {
        message: "Registration failed",
        errors: backendErrors,
        value: formValues,
      };
    }
    return { message: "Registration successful!", success: true };
  } catch {
    return {
      message: "Server error",
      errors: { general: ["Could not register user"] },
      value: formValues,
    };
  }
}

type LoginState = {
  message?: string;
  errors?: { email?: string[]; password?: string[]; overall?: string };
  value?: {
    email?: string;
    password?: string;
  };
};

export async function loginUser(
  _: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = formData.get("email")?.toString() || "";
  const password = formData.get("password")?.toString() || "";

  const defaultValues = { email: email, password: password };

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      }
    );

    if (!res.ok) {
      const err = await res.json();
      return {
        message: "Login Failed",
        errors: { overall: err.message },
        value: defaultValues,
      };
    }

    const { access_token, refresh_token, userId, userRole } = await res.json();
    // console.log("token",access_token);
    // console.log("userID:",userId);
    // console.log("role:",userRole);

    (await cookies()).set("token", access_token, {
      httpOnly: true,
      path: "/",
    });

    (await cookies()).set("refreshToken", refresh_token, {
      httpOnly: true,
      path: "/",
    });

    (await cookies()).set("userId", Encrypt(userId), {
      httpOnly: true,
      path: "/",
    });

    (await cookies()).set("userRole", Encrypt(userRole), {
      httpOnly: true,
      path: "/",
    });

    return { message: "Login successful" };
  } catch (error) {
    console.error("Login failed:", error);
    return {
      message: "Server error",
      errors: { email: ["Something went wrong"] },
    };
  }
}

export async function googleLoginAction(formData: FormData) {
  const token = formData.get("token");

  if (!token) {
    return { success: false, message: "Google token is missing" };
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL!}/auth/google-login`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    }
  );

  const data = await res.json();

  if (res.ok && data?.access_token && data?.refresh_token) {
    const cookieStore = await cookies();
    cookieStore.set("token", data.access_token, { httpOnly: true, path: "/" });
    cookieStore.set("refreshToken", data.refresh_token, {
      httpOnly: true,
      path: "/",
    });
    cookieStore.set("userId", Encrypt(data.userId), {
      httpOnly: true,
      path: "/",
    });
    cookieStore.set("userRole", Encrypt(data.userRole), {
      httpOnly: true,
      path: "/",
    });

    return { success: true, message: "Google login successful" };
  }

  return { success: false, message: "Invalid Google login" };
}

export async function logout() {
  // Deletes the userId cookie
  (await cookies()).delete("refreshToken");
  (await cookies()).delete("token");
  (await cookies()).delete("userId");
  (await cookies()).delete("userRole");
  // Redirect to login page
  redirect("/login");
}

interface DeleteState {
  message?: string;
  error?: string;
}

export async function deleteAppointment(
  _: DeleteState,
  formData: FormData
): Promise<DeleteState> {
  const id = formData.get("id")?.toString();
  if (!id) return { error: "Invalid ID" };
  console.log("Id of appointment" + id);

  const res = await deleteAppointmentApi(id);

  if (!res.ok) {
    const err = await res.json();
    return {
      message: err.message || "unable to delete the appointment",
      error: "unable to delete the Appointment",
    };
  }

  // const data = await res.json();
  // console.log("Action after deletion:", data);
  // console.log("doctorID", data.doctor._id);
  // console.log("slots", data.slot);

  return { message: "Appointment removed successfully" };
}

interface UpdateState {
  message?: string;
  error?: string;
}

export async function updateAppointmentStatus(
  prevState: any,
  formData: FormData
): Promise<UpdateState> {
  const id = formData.get("id")?.toString();
  const status = formData.get("status")?.toString();

  if (!id || !status) {
    return { error: "Invalid request" };
  }

  try {
    const res = await UpdateAppointmentStatusApi(id, status);
    if (!res.ok) {
      const err = await res.json();
      return {
        error: err.message || "Unable to update appointment status",
      };
    }

    // const data = await res.json();
    // console.log("this is from the admin panel", data.doctor._id);
    // console.log("this is from the admin panel", data.slot);


    return { message: "Status updated successfully" };
  } catch (e) {
    console.error("Status update failed:", e);
    return { error: "Failed to update status" };
  }
}

interface RefreshSessionResult {
  success?: boolean;
  redirectPath?: string;
  error?: string;
}

export async function refreshSession(
  _: RefreshSessionResult,
  formData: FormData
): Promise<RefreshSessionResult> {
  const redirectPath = formData.get("redirectPath")?.toString() || "/";
  console.log("redirect path from refresh session", redirectPath);

  const refreshToken = await GetTokenFromCookie("refreshToken");
  // console.log("refresh token from refresh session action",refreshToken);

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/refresh`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      }
    );

    if (!res.ok) {
      return { error: "Session expired. Please log in again." };
    }

    const { access_token, userId, userRole } = await res.json();

    // console.log("data from refresh session",access_token,userId,userRole)

    const cookieStore = cookies();

    (await cookieStore).set("token", access_token, {
      httpOnly: true,
      path: "/",
    });

    (await cookieStore).set("userId", Encrypt(userId), {
      httpOnly: true,
      path: "/",
    });

    (await cookieStore).set("userRole", Encrypt(userRole), {
      httpOnly: true,
      path: "/",
    });

    return { success: true, redirectPath };
  } catch (err:any) {
    console.log(err.message)
    return { error: "Could not refresh session" };
  }
}

const doctorSchema = z.object({
  name: z.string().min(1, "Name is required"),
  specialization: z.string().min(1, "Specialization is required"),
  experience: z.coerce.number().min(0, "Experience must be a number"),
  slots: z.array(z.string()).min(1, "At least one slot must be selected"),
});

export type DoctorState = {
  message?: string;
  errors: Record<string, string[]>;
  values?: {
    name: string;
    specialization: string;
    experience: string;
    slots: string[];
  };
};

export async function createDoctor(
  prevState: DoctorState,
  formData: FormData
): Promise<DoctorState> {
  const rawValues = {
    name: formData.get("name")?.toString() || "",
    specialization: formData.get("specialization")?.toString() || "",
    experience: formData.get("experience")?.toString() || "",
    slots: formData.getAll("slots").map(String),
  };
  const result = doctorSchema.safeParse(rawValues);

  if (!result.success) {
    return {
      message: undefined,
      errors: result.error.flatten().fieldErrors,
      values: rawValues,
    };
  }

  const doctorData = {
    ...result.data,
  };
  const token = await GetTokenFromCookie("token");
  console.log("token from the create doctor", token);

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/doctors`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(doctorData),
  });

  if (res.status === 401) {
    console.log("Token expired or unauthorized");
    throw new Error("unauthorized");
  }

  if (!res.ok) {
    return {
      message: "Failed to create doctor",
      errors: {},
    };
  }

  revalidatePath("/dashboard/manage-doctors");
  revalidatePath("/dashboard/manage-doctors/update");
  revalidatePath("/dashboard/manage-doctors/delete");
  return { message: "Doctor created successfully!", errors: {} };
}

export type DoctorUpdateState = {
  message?: string;
  errors: Record<string, string[]>;
  values?: {
    id: string;
    experience: string;
    slots: string[];
  };
};

const updateDoctorSchema = z.object({
  id: z.string().min(1, "Doctor ID is required"),
  experience: z.coerce.number().min(0, "Experience must be a valid number"),
  slots: z.array(z.string()).min(1, "At least one slot must be selected"),
});

export async function updateDoctor(
  prevState: DoctorUpdateState,
  formData: FormData
): Promise<DoctorUpdateState> {
  const rawValues = {
    id: formData.get("id")?.toString() || "",
    experience: formData.get("experience")?.toString() || "",
    slots: formData.getAll("slots").map(String),
  };
  const result = updateDoctorSchema.safeParse(rawValues);

  if (!result.success) {
    return {
      message: undefined,
      errors: result.error.flatten().fieldErrors,
      values: rawValues,
    };
  }

  const token = await GetTokenFromCookie("token");

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/doctors/update-doctor/${result.data.id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        experience: result.data.experience,
        slots: result.data.slots,
      }),
    }
  );
  
  if (response.status === 401) {
    console.log("Token expired or unauthorized");
    throw new Error("unauthorized");
  }

  if (!response.ok) {
    return {
      message: "Failed to update doctor",
      errors: {},
      values: rawValues,
    };
  } 

  revalidatePath("/dashboard/manage-doctors/update");

  return {
    message: "Doctor updated successfully!",
    errors: {},
  };
}





export type DeleteDoctorState = {
  message?: string;
  errors?: Record<string, string[]>;
};

const deleteSchema = z.object({
  id: z.string().min(1, 'Doctor ID is required'),
});

export async function deleteDoctor(prevState: DeleteDoctorState, formData: FormData): Promise<DeleteDoctorState> {
  const result = deleteSchema.safeParse({
    id: formData.get('id'),
  });

  if (!result.success) {
    return {
      message: undefined,
      errors: result.error.flatten().fieldErrors,
    };
  }

const token=await GetTokenFromCookie("token")

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/doctors/${result.data.id}`, {
    method: 'DELETE',
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status === 401) {
    console.log("Token expired or unauthorized");
    throw new Error("unauthorized");
  }

  if (!res.ok) {
    return {
      message: 'Failed to delete doctor',
      errors: {},
    };
  }

  revalidatePath('/dashboard/manage-doctors/delete');
  return {
    message: 'Doctor deleted successfully',
    errors: {},
  };
}