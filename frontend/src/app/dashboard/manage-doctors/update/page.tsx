import UpdateDoctorForm from "@/components/admin/doctors/updateDoctorForm";
import { getDoctors } from "@/lib/data";

export default async function UpdateDoctorPage() {
  const doctors=await getDoctors();
    return (
      <div>
        <UpdateDoctorForm doctors={doctors}/>
      </div>
    );
  }
