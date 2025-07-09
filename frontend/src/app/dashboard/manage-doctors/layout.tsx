'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const navLinks = [
  { label: 'Create Doctor', href: '/dashboard/manage-doctors' },
  { label: 'Update Doctor', href: '/dashboard/manage-doctors/update' },
  { label: 'Delete Doctor', href: '/dashboard/manage-doctors/delete' },
];

export default function DoctorsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="p-3">
      {/* Nav Tabs */}
      <nav className="flex justify-center  space-x-4 border-b-2 border-gray-300 pb-2 mb-6">
        {navLinks.map((link) => {
         const isActive =
         link.href === '/dashboard/manage-doctors'
           ? pathname === '/dashboard/manage-doctors'
           : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                'px-4 py-2 rounded-t-md text-sm font-medium transition',
                isActive
                  ? 'bg-purple-600 text-white shadow'
                  : 'bg-gray-100 text-gray-700 hover:bg-purple-100'
              )}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Page Content */}
      <div>{children}</div>
    </div>
  );
}
