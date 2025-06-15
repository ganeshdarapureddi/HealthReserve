'use client';
import Link from 'next/link';
import Image from 'next/image';

import Navlinks from './navlinks';
import { logout } from '@/app/lib/action';
import { UserContext } from '@/app/usecontext';

interface Props {

  userId: string | boolean;
  userRole: string | boolean;
}
export default function SideNav(props: Props) {

  return (
<aside className="relative flex flex-col w-full md:h-screen md:overflow-y-auto border-b-2 md:border-b-0 md:border-r-2 border-gray-200">
      {/* Logo */}
      <div className="p-4 flex items-center gap-2">
        <Image src="/logo.jpg" width={40} height={40} alt="Health Reserve logo" />
        <span className="text-2xl font-bold font-sans">Health Reserve</span>
      </div>

      {/* Nav Links */}
      <UserContext.Provider value={{ userId: props.userId, userRole: props.userRole }}>
        <Navlinks />
      </UserContext.Provider>

      {/* Sign out button */}
      <div className="mt-auto p-4">
        <form action={logout}>
          <button className=" w-full px-6 py-3 text-white font-semibold rounded-lg bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-center transition">
            Sign Out
          </button>
        </form>
      </div>
    </aside>


  );
}
