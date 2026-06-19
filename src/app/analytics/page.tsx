"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProgressChart } from "@/components/ProgressChart";
import { getSessions } from "@/lib/storage";
import type { InterviewSession } from "@/lib/types";
import { ROLE_LABELS } from "@/lib/types";

export default function AnalyticsPage() {
  const [sessions, setSessions] = useState<InterviewSession[]>([]);
  const [name, setName] = useState("");

  useEffect(() => {
    async function load() {
      const local = getSessions().filter((s) => s.status === "completed");
      try {
        const res = await fetch("/api/sessions");
        const data = await res.json();
        const fromDb = (data.sessions ?? []).filter(
          (s: InterviewSession) => s.status === "completed",
        );
        const merged = new Map<string, InterviewSession>();
        [...fromDb, ...local].forEach((s) => merged.set(s.id, s));
        setSessions(Array.from(merged.values()));
      } catch {
        setSessions(local);
      }
    }
    load();
  }, []);

  const filtered = name.trim()
    ? sessions.filter((s) =>
        s.config.candidateName.toLowerCase().includes(name.toLowerCase()),
      )
    : sessions;

  const scores = filtered
    .slice(0, 8)
    .reverse()
    .map((s, i) => ({
      label: `#${i + 1}`,
      score: s.overallScore,
    }));

  const avg =
    filtered.length > 0
      ? Math.round(
          filtered.reduce((a, s) => a + s.overallScore, 0) / filtered.length,
        )
      : 0;

  const best = filtered.length
    ? Math.max(...filtered.map((s) => s.overallScore))
    : 0;

  const byRole = filtered.reduce(
    (acc, s) => {
      const r = ROLE_LABELS[s.config.role];
      acc[r] = (acc[r] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <div>
      <div className="page-header">
        <div className="page-header-inner flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="section-label mb-2">Analytics</p>
            <h1 className="text-2xl font-semibold text-zinc-900">Progress</h1>
            <p className="mt-1 text-sm text-zinc-500">
              Track scores and improvement over time
            </p>
          </div>
          <input
            className="input-field max-w-xs"
            placeholder="Filter by name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
      </div>

      <div className="page-body">
        <div className="mx-auto max-w-3xl space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard label="Interviews done" value={String(filtered.length)} />
            <StatCard
              label="Average score"
              value={filtered.length ? `${avg}%` : "—"}
            />
            <StatCard label="Best score" value={filtered.length ? `${best}%` : "—"} />
          </div>

          <div className="card p-6">
            <h2 className="mb-6 text-sm font-semibold text-zinc-900">
              Score trend (recent)
            </h2>
            <ProgressChart scores={scores} />
          </div>

          {Object.keys(byRole).length > 0 && (
            <div className="card p-6">
              <h2 className="mb-4 text-sm font-semibold text-zinc-900">
                Practice by role
              </h2>
              <div className="flex flex-wrap gap-2">
                {Object.entries(byRole).map(([role, count]) => (
                  <span key={role} className="badge badge-neutral">
                    {role}: <strong className="text-zinc-900">{count}</strong>
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="pt-2">
            <Link href="/interview" className="btn-accent">
              Take another mock interview
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="card p-5">
      <p className="text-2xl font-semibold tabular-nums text-zinc-900">{value}</p>
      <p className="mt-0.5 text-xs text-zinc-400">{label}</p>
    </div>
  );
}
