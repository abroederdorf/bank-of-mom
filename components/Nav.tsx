"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "./AuthProvider";
import { signOut } from "@/lib/auth";

export default function Nav() {
  const { user, role } = useAuth();
  const pathname = usePathname();

  if (!user) return null;

  const links = [
    { href: "/", label: "Summary" },
    { href: "/transactions/", label: "Transactions" },
    ...(role === "parent" ? [{ href: "/manage/", label: "Manage" }] : []),
  ];

  return (
    <nav className="bg-green-700 text-white px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-1">
        <span className="font-bold text-lg mr-4">Bank of Mom</span>
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              pathname === l.href
                ? "bg-white text-green-700"
                : "hover:bg-green-600"
            }`}
          >
            {l.label}
          </Link>
        ))}
      </div>
      <button
        onClick={() => signOut()}
        className="text-sm hover:underline opacity-80"
      >
        Sign out
      </button>
    </nav>
  );
}
