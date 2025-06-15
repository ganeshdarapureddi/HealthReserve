'use client';

import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useUser } from '@/app/usecontext';

export default function Navlinks() {
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

  const linksToRender = user?.userRole === 'admin' ? navLinksAdmin : navLinksUser;

  return (
    <nav className="space-y-2 mt-4 px-4">
      {linksToRender.map((link) => (
        <Link
          key={link.name}
          href={link.href}
          className={`flex items-center gap-3 px-4 py-2 rounded text-gray-600 hover:bg-purple-100 hover:text-purple-700 transition ${pathname === link.href ? 'bg-purple-200 text-purple-700 font-semibold' : ''
            }`}
        >
          <Image src={link.icon} width={20} height={20} alt={link.name} />
          <span>{link.name}</span>
        </Link>
      ))}
    </nav>

  );
}
