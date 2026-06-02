"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { TrendingUp } from "lucide-react";
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
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="flex items-center gap-2 text-sm text-indigo-400">
            <TrendingUp className="h-4 w-4" />
            Your improvement over time
          </span>
          <h1 className="mt-1 text-3xl font-bold text-white">Progress</h1>
        </div>
        <input
          className="input-field max-w-xs"
          placeholder="Filter by name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <StatCard label="Interviews done" value={String(filtered.length)} />
        <StatCard label="Average score" value={filtered.length ? `${avg}%` : "—"} />
        <StatCard label="Best score" value={filtered.length ? `${best}%` : "—"} />
      </div>

      <div className="glass mb-8 rounded-2xl p-6">
        <h2 className="mb-6 font-semibold text-white">Score trend (recent)</h2>
        <ProgressChart scores={scores} />
      </div>

      {Object.keys(byRole).length > 0 && (
        <div className="glass mb-8 rounded-2xl p-6">
          <h2 className="mb-4 font-semibold text-white">Practice by role</h2>
          <div className="flex flex-wrap gap-3">
            {Object.entries(byRole).map(([role, count]) => (
              <span
                key={role}
                className="rounded-full bg-white/5 px-4 py-2 text-sm text-slate-300"
              >
                {role}: <strong className="text-white">{count}</strong>
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="text-center">
        <Link href="/interview" className="btn-primary">
          Take another mock interview
        </Link>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass rounded-2xl p-5 text-center">
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="mt-1 text-sm text-slate-400">{label}</p>
    </div>
  );
}
