"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "./AuthProvider";
import { signOut } from "@/lib/auth";

export default function Nav() {
  const { user, role } = useAuth();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  if (!user) return null;

  const links = [
    { href: "/", label: "Summary" },
    { href: "/transactions/", label: "Transactions" },
    ...(role === "parent" ? [{ href: "/manage/", label: "Manage" }] : []),
  ];

  return (
    <nav className="bg-green-700 text-white px-4 py-3">
      <div className="flex items-center justify-between">
        <span className="font-bold text-lg">Bank of Mom</span>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                pathname === l.href ? "bg-white text-green-700" : "hover:bg-green-600"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => signOut()}
            className="hidden md:block text-sm hover:underline opacity-80"
          >
            Sign out
          </button>
          {/* Hamburger */}
          <button
            className="md:hidden p-1 rounded hover:bg-green-600"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden mt-2 flex flex-col gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                pathname === l.href ? "bg-white text-green-700" : "hover:bg-green-600"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <button
            onClick={() => signOut()}
            className="px-3 py-2 rounded text-sm font-medium text-left hover:bg-green-600 opacity-80"
          >
            Sign out
          </button>
        </div>
      )}
    </nav>
  );
}
