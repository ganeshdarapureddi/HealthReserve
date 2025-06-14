'use client';
import Link from 'next/link';
import Image from 'next/image';
import '@/app/ui/dashboard/sidenav.css';
import Navlinks from './navlinks';
import { logout } from '@/app/lib/action';
import { UserContext } from '@/app/usecontext';

interface Props {

  userId: string | boolean;
  userRole: string | boolean;
}
export default function SideNav(props: Props) {

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <Link href="/" className="sidebar-brand">
          <Image src="/logo.png" width={40} height={40} alt="HealthReserve Logo" />
          <span className="brand-name">HealthReserve</span>
        </Link>
      </div>

      <UserContext.Provider value={{ userId: props.userId, userRole: props.userRole }}>
        <Navlinks />
      </UserContext.Provider>

      <form action={logout}>
        <button type="submit" className="signout-btn">

          <span>Sign Out</span>
        </button>
      </form>
    </aside>
  );
}
