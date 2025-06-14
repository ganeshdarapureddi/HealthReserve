import SideNav from '@/app/ui/dashboard/sidenav';
import './layout.css';
import { cookies } from 'next/headers';
import { validateToken } from '../lib/auth';


export const experimental_ppr = true;

export default async function Layout({ children }: { children: React.ReactNode }) {
  const userId1 = (await cookies()).get('userId')?.value;
  const userId = validateToken(userId1);
  const userRole1 = (await cookies()).get('userRole')?.value;
  const userRole = validateToken(userRole1);
  console.log("user at layout",userRole)

  return (
    <div className="dashboard-layout">
      <div className="dashboard-sidebar">
      
          <SideNav userId={userId} userRole={userRole} />
   

      </div>
      <div className="dashboard-content">
        {children}
      </div>
    </div>
  );
}
