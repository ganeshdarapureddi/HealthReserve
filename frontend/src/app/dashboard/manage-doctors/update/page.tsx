import UpdateDoctorForm from "@/components/admin/doctors/updateDoctorForm";
import { getDoctors } from "@/lib/data";
import { redirect } from "next/navigation";

export default async function UpdateDoctorPage() {
  try{
  const doctors=await getDoctors();
    return (
      <div>
        <UpdateDoctorForm doctors={doctors}/>
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
