"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CheckCircle2, Download, RotateCcw } from "lucide-react";
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
    return <div className="py-20 text-center text-slate-400">Loading…</div>;
  }

  if (!session || session.status !== "completed") {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <p className="mb-4 text-slate-400">Results not found.</p>
        <Link href="/interview" className="btn-primary">
          Start interview
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="mb-10 text-center">
        <p className="mb-4 text-sm font-medium text-indigo-400">Interview complete</p>
        <h1 className="mb-6 text-3xl font-bold text-white">
          Great work, {session.config.candidateName}!
        </h1>
        <div className="flex justify-center">
          <ScoreBadge score={session.overallScore} size="lg" />
        </div>
        <p className="mx-auto mt-6 max-w-xl text-slate-400">{session.summary}</p>
      </div>

      <div className="mb-8 grid gap-6 sm:grid-cols-2">
        <div className="glass rounded-2xl p-6">
          <h2 className="mb-4 flex items-center gap-2 font-semibold text-green-400">
            <CheckCircle2 className="h-5 w-5" />
            Strengths
          </h2>
          <ul className="space-y-2 text-sm text-slate-300">
            {session.strengths.map((s) => (
              <li key={s}>• {s}</li>
            ))}
          </ul>
        </div>
        <div className="glass rounded-2xl p-6">
          <h2 className="mb-4 font-semibold text-amber-400">Areas to improve</h2>
          <ul className="space-y-2 text-sm text-slate-300">
            {session.improvements.map((s) => (
              <li key={s}>• {s}</li>
            ))}
          </ul>
        </div>
      </div>

      <h2 className="mb-4 text-xl font-bold text-white">Question breakdown</h2>
      <div className="space-y-4">
        {session.answers.map((a, i) => (
          <div key={a.questionId} className="glass rounded-2xl p-5">
            <div className="mb-2 flex items-start justify-between gap-4">
              <p className="text-sm font-medium text-slate-400">Q{i + 1}</p>
              <span
                className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                  a.score >= 80
                    ? "bg-green-500/20 text-green-400"
                    : a.score >= 65
                      ? "bg-yellow-500/20 text-yellow-400"
                      : "bg-orange-500/20 text-orange-400"
                }`}
              >
                {a.score}/100
              </span>
            </div>
            <p className="mb-3 font-medium text-white">{a.question}</p>
            <p className="mb-3 text-sm text-slate-400 line-clamp-3">{a.answer}</p>
            <p className="text-sm text-indigo-300">{a.feedback}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <button type="button" onClick={downloadReport} className="btn-secondary">
          <Download className="h-4 w-4" />
          Download report
        </button>
        <Link href="/interview" className="btn-primary">
          <RotateCcw className="h-4 w-4" />
          New interview
        </Link>
        <Link href="/dashboard" className="btn-secondary">
          Dashboard
        </Link>
      </div>
    </div>
  );
}
