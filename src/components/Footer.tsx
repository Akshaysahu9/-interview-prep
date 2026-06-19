import Link from "next/link";
import { app } from "@/lib/config";

const FOOTER_LINKS = {
  Product: [
    { href: "/interview", label: "Mock Interview" },
    { href: "/resume", label: "Resume Review" },
    { href: "/dsa", label: "Coding Practice" },
    { href: "/analytics", label: "Progress" },
  ],
  Account: [
    { href: "/dashboard", label: "Sessions" },
    { href: "/interview", label: "New Session" },
  ],
};

export function Footer() {
  return (
    <footer className="mt-auto border-t border-zinc-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-4">
          <div className="sm:col-span-2">
            <div className="mb-3 flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-zinc-900 text-[10px] font-bold text-white">
                R1
              </span>
              <span className="text-sm font-semibold text-zinc-900">{app.name}</span>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-zinc-500">
              Structured interview prep — mock rounds, resume feedback, and coding
              practice with actionable reports.
            </p>
          </div>

          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                {section}
              </h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-zinc-600 transition-colors hover:text-zinc-900"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-zinc-100 pt-6 sm:flex-row">
          <p className="text-xs text-zinc-400">
            © {new Date().getFullYear()} {app.name}. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-zinc-400">
            <span className="cursor-default">Privacy</span>
            <span className="cursor-default">Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
