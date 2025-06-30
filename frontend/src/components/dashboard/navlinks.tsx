'use client';

import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useUser } from '@/app/context';
import { Role } from '@/enums/role';

export default function NavLinks() {
  const pathname = usePathname();
  const user = useUser();
  console.log("user Role at the side nav", user?.userRole);


  const navLinksUser = [
    { name: 'Home', href: '/dashboard', icon: '/icons/home.svg' },
    { name: 'Doctors', href: '/dashboard/doctors', icon: '/icons/doctor.svg' },
    { name: 'Book Appointment', href: '/dashboard/appointment', icon: '/icons/book.svg' },
  ];

  const navLinksAdmin = [
    { name: 'Home', href: '/dashboard', icon: '/icons/home.svg' },
    { name: 'Admin Panel', href: '/dashboard/admin', icon: '/icons/admin.svg' },
  ];

  const linksToRender = user?.userRole === Role.Admin ? navLinksAdmin : navLinksUser;

  return (
    <nav className="flex w-full flex-row md:flex-col  space-x-2 md:px-4 gap-3 md:space-x-2 md:space-y-1 mt-2">
      {linksToRender.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={`flex items-center gap-3 px-6 py-2 rounded transition whitespace-nowrap ${
              isActive
                ? 'bg-purple-200 text-purple-700 font-semibold'
                : 'text-gray-600 hover:bg-purple-100 hover:text-purple-700'
            }`} 
          >
            <Image src={link.icon} width={20} height={20} alt={link.name} />
            <span>{link.name}</span>
          </Link>
        );
      })}
    </nav>

  );
}
