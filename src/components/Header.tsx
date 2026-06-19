"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { app } from "@/lib/config";

const NAV = [
  { href: "/interview", label: "Mock Interview" },
  { href: "/resume", label: "Resume" },
  { href: "/dsa", label: "Coding" },
  { href: "/analytics", label: "Progress" },
  { href: "/dashboard", label: "Sessions" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-zinc-900 text-xs font-bold tracking-tight text-white">
            R1
          </span>
          <span className="text-sm font-semibold tracking-tight text-zinc-900">
            {app.name}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                  active
                    ? "bg-zinc-100 font-medium text-zinc-900"
                    : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/interview" className="btn-accent hidden text-sm sm:inline-flex">
            Start interview
          </Link>
          <Link
            href="/interview"
            className="btn-accent inline-flex text-sm sm:hidden"
          >
            Start
          </Link>
        </div>
      </div>
    </header>
  );
}
