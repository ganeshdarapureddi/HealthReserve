"use client"
import Link from "next/link";
export default function ButtonLink({ children, route }: { children: React.ReactNode, route: string }) {
    return (
        <Link
            href={route}
            className="px-6 py-3 text-white font-semibold rounded-lg bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-center transition"
        >
            {children}
        </Link>
    )
}