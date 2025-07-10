import DeleteDoctorForm from "@/components/admin/doctors/deleteDoctorForm";
import { getDoctors } from "@/lib/data";
import { redirect } from "next/navigation";

export default async function DeleteDoctorPage() {
  try{
  const doctors=await getDoctors();
    return (
      <div>
        <DeleteDoctorForm doctors={doctors}/>
      </div>
    );
  }
    catch (err: any) {
      if (err.message === "unauthorized") {
        redirect(`/expire?from=/dashboard/manage-doctors/update`);
      }
      throw err;
    }
  }
  