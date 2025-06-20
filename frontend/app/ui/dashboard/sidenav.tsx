'use client';

import Image from 'next/image';
import NavLinks from './navlinks';
import { logout } from '@/app/lib/action';
import { UserContext } from '@/app/context';

interface Props {
  userId: string | null;
  userRole: string | null;
}

export default function SideNav(props: Props) {
  return (
    <aside className="w-full  md:w-[280px]  md:border-b-0 md:border-r-2 border-gray-200">
      <div className="flex flex-row items-center md:flex-col md:items-center h-full md:h-screen overflow-y-auto">
        {/* Logo */}  
        <div className="p-4 flex items-center gap-2 mr-10 md:mr-1">
          <Image src="/logo.jpg" width={40} height={40} alt="Health Reserve logo" />
          <span className="text-lg md:text-2xl font-bold font-sans ">Health Reserve</span>
        </div>

        {/* Nav Links */}
       
        <UserContext.Provider value={{ userId: props.userId, userRole: props.userRole }}>
          <NavLinks />
        </UserContext.Provider>
        


        {/* Sign out button - sticks to bottom only on desktop */}
        <div className="md:mt-auto p-4 w-full ">
          <form action={logout}>
            <button className="w-30 px-4 py-2 text-white font-semibold rounded-lg bg-gradient-to-r from-purple-600 to-indigo-700 md:w-full hover:from-purple-700 hover:to-indigo-800 transition ">
              Sign Out
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}
