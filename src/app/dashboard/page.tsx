"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Calendar, ChevronRight, Plus } from "lucide-react";
import { getSessions } from "@/lib/storage";
import { LEVEL_LABELS, ROLE_LABELS, type InterviewSession } from "@/lib/types";

export default function DashboardPage() {
  const [sessions, setSessions] = useState<InterviewSession[]>([]);

  useEffect(() => {
    setSessions(getSessions());
  }, []);

  return (
    <div>
      <div className="page-header">
        <div className="page-header-inner flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="section-label mb-2">Sessions</p>
            <h1 className="text-2xl font-semibold text-zinc-900">Your interviews</h1>
            <p className="mt-1 text-sm text-zinc-500">
              Recent mock interviews and reports
            </p>
          </div>
          <Link href="/interview" className="btn-accent">
            <Plus className="h-4 w-4" />
            New interview
          </Link>
        </div>
      </div>

      <div className="page-body">
        <div className="mx-auto max-w-3xl">
          {sessions.length === 0 ? (
            <div className="card p-12 text-center">
              <p className="mb-1 text-sm font-medium text-zinc-900">No sessions yet</p>
              <p className="mb-6 text-sm text-zinc-500">
                Start your first mock interview to see it here.
              </p>
              <Link href="/interview" className="btn-accent">
                Get started
              </Link>
            </div>
          ) : (
            <div className="card overflow-hidden divide-y divide-zinc-100">
              {sessions.map((s) => (
                <Link
                  key={s.id}
                  href={
                    s.status === "completed" ? `/results/${s.id}` : `/interview/${s.id}`
                  }
                  className="flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-zinc-50"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-zinc-900">
                      {s.config.candidateName}
                      <span className="font-normal text-zinc-400">
                        {" "}
                        · {ROLE_LABELS[s.config.role]}
                      </span>
                    </p>
                    <p className="mt-0.5 flex items-center gap-1.5 text-xs text-zinc-400">
                      <Calendar className="h-3 w-3" />
                      {new Date(s.createdAt).toLocaleString()} ·{" "}
                      {LEVEL_LABELS[s.config.level]}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    {s.status === "completed" ? (
                      <span
                        className={`badge tabular-nums ${
                          s.overallScore >= 80
                            ? "badge-success"
                            : s.overallScore >= 65
                              ? "badge-warning"
                              : "badge-neutral"
                        }`}
                      >
                        {s.overallScore}%
                      </span>
                    ) : (
                      <span className="badge badge-warning">In progress</span>
                    )}
                    <ChevronRight className="h-4 w-4 text-zinc-300" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
