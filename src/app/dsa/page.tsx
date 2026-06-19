"use client";

import { useState } from "react";
import { Code2, Loader2 } from "lucide-react";
import { DSA_PROBLEMS } from "@/lib/dsa";

export default function DsaPage() {
  const [active, setActive] = useState(0);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [feedback, setFeedback] = useState("");

  const problem = DSA_PROBLEMS[active];

  async function submit() {
    setLoading(true);
    setScore(null);
    try {
      const res = await fetch("/api/dsa/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problemId: problem.id, code }),
      });
      const data = await res.json();
      setScore(data.score);
      setFeedback(data.feedback);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-header-inner">
          <p className="section-label mb-2">Coding</p>
          <h1 className="text-2xl font-semibold text-zinc-900">Coding practice</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Work through common interview problems and get structured feedback on your
            approach.
          </p>
        </div>
      </div>

      <div className="page-body">
        <div className="mb-5 flex flex-wrap gap-1.5">
          {DSA_PROBLEMS.map((p, i) => (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                setActive(i);
                setCode("");
                setScore(null);
                setFeedback("");
              }}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                active === i
                  ? "bg-zinc-900 text-white"
                  : "border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50"
              }`}
            >
              {p.title}
            </button>
          ))}
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <div className="card p-6">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span
                className={`badge ${
                  problem.difficulty === "Easy" ? "badge-success" : "badge-warning"
                }`}
              >
                {problem.difficulty}
              </span>
              {problem.topics.map((t) => (
                <span key={t} className="text-xs text-zinc-400">
                  {t}
                </span>
              ))}
            </div>
            <p className="mb-5 text-sm leading-relaxed text-zinc-700">
              {problem.description}
            </p>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Examples
            </h3>
            <ul className="mb-5 space-y-1">
              {problem.examples.map((ex) => (
                <li key={ex} className="font-mono text-xs text-zinc-600">
                  {ex}
                </li>
              ))}
            </ul>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Hints
            </h3>
            <ul className="space-y-1">
              {problem.hints.map((h) => (
                <li key={h} className="text-sm text-zinc-600">
                  {h}
                </li>
              ))}
            </ul>
          </div>

          <div className="card p-6">
            <label className="label flex items-center gap-2">
              <Code2 className="h-4 w-4 text-zinc-400" />
              Your solution
            </label>
            <p className="mb-3 text-xs text-zinc-400">JavaScript or pseudocode</p>
            <textarea
              rows={14}
              className="input-field mb-4 font-mono text-sm"
              placeholder="// Brute force → optimize → state complexity"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <button
              type="button"
              className="btn-accent w-full"
              onClick={submit}
              disabled={loading || code.trim().length < 20}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Submit for feedback"
              )}
            </button>
            {score !== null && (
              <div className="mt-4 rounded-md border border-teal-200 bg-teal-50 p-4">
                <p className="text-sm font-semibold tabular-nums text-zinc-900">
                  Score: {score}/100
                </p>
                <p className="mt-1 text-sm text-zinc-600">{feedback}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
