"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Calendar, ChevronRight } from "lucide-react";
import { getSessions } from "@/lib/storage";
import { LEVEL_LABELS, ROLE_LABELS, type InterviewSession } from "@/lib/types";

export default function DashboardPage() {
  const [sessions, setSessions] = useState<InterviewSession[]>([]);

  useEffect(() => {
    setSessions(getSessions());
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Sessions</h1>
          <p className="mt-1 text-slate-400">
            Recent mock interviews and reports
          </p>
        </div>
        <Link href="/interview" className="btn-primary">
          New interview
        </Link>
      </div>

      {sessions.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center">
          <p className="mb-4 text-slate-400">No sessions yet. Start your first mock interview!</p>
          <Link href="/interview" className="btn-primary">
            Get started
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {sessions.map((s) => (
            <li key={s.id}>
              <Link
                href={
                  s.status === "completed" ? `/results/${s.id}` : `/interview/${s.id}`
                }
                className="glass flex items-center justify-between gap-4 rounded-2xl p-5 transition hover:border-indigo-500/40"
              >
                <div>
                  <p className="font-semibold text-white">
                    {s.config.candidateName} · {ROLE_LABELS[s.config.role]}
                  </p>
                  <p className="mt-1 flex items-center gap-2 text-sm text-slate-400">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(s.createdAt).toLocaleString()} ·{" "}
                    {LEVEL_LABELS[s.config.level]}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {s.status === "completed" ? (
                    <span
                      className={`rounded-full px-3 py-1 text-sm font-bold ${
                        s.overallScore >= 80
                          ? "bg-green-500/20 text-green-400"
                          : "bg-indigo-500/20 text-indigo-300"
                      }`}
                    >
                      {s.overallScore}%
                    </span>
                  ) : (
                    <span className="rounded-full bg-amber-500/20 px-3 py-1 text-sm text-amber-300">
                      In progress
                    </span>
                  )}
                  <ChevronRight className="h-5 w-5 text-slate-500" />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
