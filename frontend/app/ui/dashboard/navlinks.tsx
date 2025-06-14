'use client';

import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useUser } from '@/app/usecontext';

export default function Navlinks() {
  const pathname = usePathname();
  const user = useUser();
  console.log("user Role at the side nav",user?.userRole);


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
    <nav className="nav-links">
      {linksToRender.map((link) => (
        <Link
          key={link.name}
          href={link.href}
          className={`nav-link ${pathname === link.href ? 'active' : ''}`}
        >
          <Image src={link.icon} width={20} height={20} alt={`${link.name} icon`} />
          <span>{link.name}</span>
        </Link>
      ))}
    </nav>
  );
}
