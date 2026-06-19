"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, FileText, Loader2 } from "lucide-react";
import type { ResumeReport } from "@/lib/resume-analysis";
import { ScoreBadge } from "@/components/ScoreBadge";

export default function ResumePage() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("Full Stack Developer");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResumeReport | null>(null);

  async function analyze(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || text.trim().length < 80) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/resume/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidateName: name,
          targetRole: role,
          resumeText: text,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error();
      setResult(data.result);
    } catch {
      alert("Analysis failed. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-header-inner">
          <p className="section-label mb-2">Resume</p>
          <h1 className="text-2xl font-semibold text-zinc-900">Resume review</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Identify skill gaps, role alignment, and what to emphasize before your next
            interview.
          </p>
        </div>
      </div>

      <div className="page-body">
        <div className="mx-auto max-w-3xl">
          <form onSubmit={analyze} className="card space-y-4 p-6 sm:p-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label" htmlFor="rname">
                  Name
                </label>
                <input
                  id="rname"
                  className="input-field"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="label" htmlFor="rrole">
                  Target role
                </label>
                <input
                  id="rrole"
                  className="input-field"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="label" htmlFor="rtext">
                Resume text
              </label>
              <p className="mb-2 text-xs text-zinc-400">
                Copy-paste from your PDF or Word document
              </p>
              <textarea
                id="rtext"
                rows={12}
                className="input-field font-mono text-xs"
                placeholder="Education, skills, projects, internships..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </div>
            <button type="submit" className="btn-accent w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analyzing…
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4" />
                  Analyze resume
                </>
              )}
            </button>
          </form>

          {result && (
            <div className="mt-8 space-y-5">
              <div className="card flex flex-col items-center gap-6 p-6 sm:flex-row sm:p-8">
                <ScoreBadge score={result.overallScore} size="lg" />
                <div className="text-center sm:text-left">
                  <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">
                    Overall fit score
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                    {result.summary}
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <ResultBlock title="Detected skills" items={result.detectedSkills} />
                <ResultBlock
                  title="Skills to add / improve"
                  items={result.missingSkills}
                  accent
                />
              </div>
              <ResultBlock title="Suggested roles" items={result.suggestedRoles} />
              <ResultBlock title="Project tips" items={result.projectTips} />
              <ResultBlock
                title="Interview focus this week"
                items={result.interviewFocus}
              />

              <Link href="/interview" className="btn-accent inline-flex">
                Start mock session
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ResultBlock({
  title,
  items,
  accent,
}: {
  title: string;
  items: string[];
  accent?: boolean;
}) {
  return (
    <div className="card p-5">
      <h3
        className={`mb-3 text-sm font-semibold ${accent ? "text-amber-700" : "text-zinc-900"}`}
      >
        {title}
      </h3>
      <ul className="space-y-1.5">
        {items.map((i) => (
          <li key={i} className="flex gap-2 text-sm text-zinc-600">
            <span className="shrink-0 text-zinc-300">—</span>
            {i}
          </li>
        ))}
      </ul>
    </div>
  );
}
