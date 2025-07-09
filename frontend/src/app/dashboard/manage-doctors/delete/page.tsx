import DeleteDoctorForm from "@/components/admin/doctors/deleteDoctorForm";
import { getDoctors } from "@/lib/data";

export default async function DeleteDoctorPage() {
  const doctors=await getDoctors();
    return (
      <div>
        <DeleteDoctorForm doctors={doctors}/>
      </div>
    );
  }
  