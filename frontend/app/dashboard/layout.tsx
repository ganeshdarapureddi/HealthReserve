import SideNav from '@/app/ui/dashboard/sidenav';
import { cookies } from 'next/headers';
import { validateToken } from '../lib/auth';

export const experimental_ppr = true;

export default async function Layout({ children }: { children: React.ReactNode }) {
  const userId1 = (await cookies()).get('userId')?.value;
  const userId = validateToken(userId1);
  const userRole1 = (await cookies()).get('userRole')?.value;
  const userRole = validateToken(userRole1);
  console.log("user at layout", userRole);

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden">
      {/* Sidebar */}
      <div className="w-full md:w-[280px] flex-shrink-0">
        <SideNav userId={userId} userRole={userRole} />
      </div>

      {/* Main content */}
      <div className="flex-grow overflow-y-auto p-6 bg-white">
        {children}
      </div>
    </div>
  );
}
