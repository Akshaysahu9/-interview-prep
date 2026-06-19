"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Download, RotateCcw } from "lucide-react";
import { ScoreBadge } from "@/components/ScoreBadge";
import { getSession } from "@/lib/storage";
import { app } from "@/lib/config";
import { LEVEL_LABELS, ROLE_LABELS, type InterviewSession } from "@/lib/types";

export default function ResultsPage() {
  const { id } = useParams<{ id: string }>();
  const [session, setSession] = useState<InterviewSession | null | undefined>(
    undefined,
  );

  useEffect(() => {
    setSession(getSession(id) ?? null);
  }, [id]);

  function downloadReport() {
    if (!session) return;
    const lines = [
      `${app.name.toUpperCase()} — SESSION REPORT`,
      "========================",
      `Candidate: ${session.config.candidateName}`,
      `Role: ${ROLE_LABELS[session.config.role]}`,
      `Level: ${LEVEL_LABELS[session.config.level]}`,
      `Score: ${session.overallScore}/100`,
      "",
      "SUMMARY",
      session.summary,
      "",
      "STRENGTHS",
      ...session.strengths.map((s) => `• ${s}`),
      "",
      "IMPROVEMENTS",
      ...session.improvements.map((s) => `• ${s}`),
      "",
      "DETAILED FEEDBACK",
      ...session.answers.map(
        (a, i) =>
          `\nQ${i + 1} (${a.score}/100): ${a.question}\nAnswer: ${a.answer}\nFeedback: ${a.feedback}`,
      ),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `interview-report-${session.id.slice(0, 8)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (session === undefined) {
    return (
      <div className="page-body py-20 text-center text-sm text-zinc-400">Loading…</div>
    );
  }

  if (!session || session.status !== "completed") {
    return (
      <div className="page-body py-20 text-center">
        <p className="mb-4 text-sm text-zinc-500">Results not found.</p>
        <Link href="/interview" className="btn-accent">
          Start interview
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-header-inner text-center">
          <p className="section-label mb-3">Session complete</p>
          <h1 className="mb-6 text-2xl font-semibold text-zinc-900">
            {session.config.candidateName}&apos;s report
          </h1>
          <div className="flex justify-center">
            <ScoreBadge score={session.overallScore} size="lg" />
          </div>
          <p className="mx-auto mt-5 max-w-lg text-sm leading-relaxed text-zinc-500">
            {session.summary}
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <span className="badge badge-neutral">{ROLE_LABELS[session.config.role]}</span>
            <span className="badge badge-neutral">{LEVEL_LABELS[session.config.level]}</span>
          </div>
        </div>
      </div>

      <div className="page-body">
        <div className="mx-auto max-w-3xl space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="card p-5">
              <h2 className="mb-3 text-sm font-semibold text-emerald-700">Strengths</h2>
              <ul className="space-y-2">
                {session.strengths.map((s) => (
                  <li key={s} className="flex gap-2 text-sm text-zinc-600">
                    <span className="shrink-0 text-emerald-400">+</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="card p-5">
              <h2 className="mb-3 text-sm font-semibold text-amber-700">
                Areas to improve
              </h2>
              <ul className="space-y-2">
                {session.improvements.map((s) => (
                  <li key={s} className="flex gap-2 text-sm text-zinc-600">
                    <span className="shrink-0 text-amber-400">→</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <h2 className="mb-4 text-sm font-semibold text-zinc-900">
              Question breakdown
            </h2>
            <div className="space-y-3">
              {session.answers.map((a, i) => (
                <div key={a.questionId} className="card p-5">
                  <div className="mb-3 flex items-start justify-between gap-4">
                    <span className="text-xs font-medium text-zinc-400">Q{i + 1}</span>
                    <span
                      className={`badge tabular-nums ${
                        a.score >= 80
                          ? "badge-success"
                          : a.score >= 65
                            ? "badge-warning"
                            : "bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20"
                      }`}
                    >
                      {a.score}/100
                    </span>
                  </div>
                  <p className="mb-2 text-sm font-medium text-zinc-900">{a.question}</p>
                  <p className="mb-3 text-sm text-zinc-500 line-clamp-3">{a.answer}</p>
                  <p className="rounded-md bg-zinc-50 px-3 py-2 text-sm text-zinc-600">
                    {a.feedback}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-3 border-t border-zinc-200 pt-6">
            <button type="button" onClick={downloadReport} className="btn-secondary">
              <Download className="h-4 w-4" />
              Download report
            </button>
            <Link href="/interview" className="btn-accent">
              <RotateCcw className="h-4 w-4" />
              New interview
            </Link>
            <Link href="/dashboard" className="btn-ghost">
              View all sessions
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
