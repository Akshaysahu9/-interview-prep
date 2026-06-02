import Link from "next/link";
import { app } from "@/lib/config";

export function Footer() {
  return (
    <footer className="border-t border-white/5 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 sm:flex-row sm:px-6">
        <p className="text-sm text-slate-500">
          © {new Date().getFullYear()} {app.name}. All rights reserved.
        </p>
        <nav className="flex flex-wrap justify-center gap-6 text-sm text-slate-500">
          <Link href="/" className="transition hover:text-slate-300">
            Product
          </Link>
          <Link href="/interview" className="transition hover:text-slate-300">
            Practice
          </Link>
          <Link href="/resume" className="transition hover:text-slate-300">
            Resume
          </Link>
          <span className="cursor-default text-slate-600">Privacy</span>
          <span className="cursor-default text-slate-600">Terms</span>
        </nav>
      </div>
    </footer>
  );
}
