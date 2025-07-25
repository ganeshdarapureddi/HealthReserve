import SideNav from '@/components/dashboard/sidenav';
import { cookies } from 'next/headers';
import { Decrypt } from '../../lib/auth';

export const experimental_ppr = true;

export default async function Layout({ children }: { children: React.ReactNode }) {
  const userId1 = (await cookies()).get('userId')?.value;
  const userId = Decrypt(userId1);
  const userRole1 = (await cookies()).get('userRole')?.value;
  const userRole = Decrypt(userRole1);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="md:fixed md:top-0 md:left-0 md:h-screen md:w-[280px] ">
        <SideNav userId={userId} userRole={userRole} />
      </div>

      {/* Main Content */}
      <div className="flex-grow p-6 bg-white w-full md:ml-[280px] h-screen overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
