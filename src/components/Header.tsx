import Link from "next/link";
import { app } from "@/lib/config";

const NAV = [
  { href: "/resume", label: "Resume" },
  { href: "/dsa", label: "Coding" },
  { href: "/analytics", label: "Progress" },
  { href: "/dashboard", label: "Sessions" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 font-semibold text-white">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold">
            R1
          </span>
          <span className="hidden sm:inline">{app.name}</span>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hidden rounded-lg px-2 py-2 text-xs text-slate-300 transition hover:bg-white/5 hover:text-white md:inline-block md:px-3 md:text-sm"
            >
              {item.label}
            </Link>
          ))}
          <Link href="/interview" className="btn-primary text-xs sm:text-sm">
            New session
          </Link>
        </nav>
      </div>
    </header>
  );
}
