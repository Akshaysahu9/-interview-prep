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
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <h1 className="mb-2 text-3xl font-bold text-white">Coding practice</h1>
      <p className="mb-8 text-slate-400">
        Work through common interview problems. Write your approach and solution, then get
        structured feedback before your next round.
      </p>

      <div className="mb-4 flex flex-wrap gap-2">
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
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
              active === i
                ? "bg-indigo-600 text-white"
                : "bg-white/5 text-slate-400 hover:bg-white/10"
            }`}
          >
            {p.title}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass rounded-2xl p-6">
          <div className="mb-3 flex items-center gap-2">
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                problem.difficulty === "Easy"
                  ? "bg-green-500/20 text-green-400"
                  : "bg-amber-500/20 text-amber-400"
              }`}
            >
              {problem.difficulty}
            </span>
            {problem.topics.map((t) => (
              <span key={t} className="text-xs text-slate-500">
                {t}
              </span>
            ))}
          </div>
          <p className="mb-4 text-slate-200">{problem.description}</p>
          <h3 className="mb-2 text-sm font-semibold text-slate-400">Examples</h3>
          <ul className="mb-4 space-y-1 text-sm text-slate-400">
            {problem.examples.map((ex) => (
              <li key={ex} className="font-mono">
                {ex}
              </li>
            ))}
          </ul>
          <h3 className="mb-2 text-sm font-semibold text-slate-400">Hints</h3>
          <ul className="space-y-1 text-sm text-indigo-300/80">
            {problem.hints.map((h) => (
              <li key={h}>• {h}</li>
            ))}
          </ul>
        </div>

        <div className="glass rounded-2xl p-6">
          <label className="label flex items-center gap-2">
            <Code2 className="h-4 w-4" />
            Your solution (JavaScript / pseudocode)
          </label>
          <textarea
            rows={14}
            className="input-field mb-4 font-mono text-sm"
            placeholder="// Brute force → optimize → state complexity"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <button
            type="button"
            className="btn-primary w-full"
            onClick={submit}
            disabled={loading || code.trim().length < 20}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit for feedback"}
          </button>
          {score !== null && (
            <div className="mt-4 rounded-xl border border-indigo-500/30 bg-indigo-500/10 p-4">
              <p className="text-lg font-bold text-white">Score: {score}/100</p>
              <p className="mt-1 text-sm text-slate-300">{feedback}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
