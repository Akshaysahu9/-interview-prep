"use client";

import Link from "next/link";
import { useState } from "react";
import { FileText, Loader2 } from "lucide-react";
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
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Resume review</h1>
        <p className="mt-2 text-slate-400">
          Paste your resume to identify skill gaps, role alignment, and what to emphasize
          before your next interview.
        </p>
      </div>

      <form onSubmit={analyze} className="glass space-y-4 rounded-2xl p-6 sm:p-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="rname">Name</label>
            <input
              id="rname"
              className="input-field"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="label" htmlFor="rrole">Target role</label>
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
            Resume text (copy-paste from PDF/Word)
          </label>
          <textarea
            id="rtext"
            rows={12}
            className="input-field font-mono text-xs"
            placeholder="Education, skills, projects, internships..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        <button type="submit" className="btn-primary w-full" disabled={loading}>
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
        <div className="mt-10 space-y-6">
          <div className="glass flex flex-col items-center rounded-2xl p-8 sm:flex-row sm:gap-8">
            <ScoreBadge score={result.overallScore} size="lg" />
            <div className="mt-4 text-center sm:mt-0 sm:text-left">
              <p className="text-sm font-medium text-slate-400">Overall fit score</p>
              <p className="mt-2 text-slate-300">{result.summary}</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <ResultBlock title="Detected skills" items={result.detectedSkills} />
            <ResultBlock title="Skills to add / improve" items={result.missingSkills} accent />
          </div>
          <ResultBlock title="Suggested roles" items={result.suggestedRoles} />
          <ResultBlock title="Project tips" items={result.projectTips} />
          <ResultBlock title="Interview focus this week" items={result.interviewFocus} />

          <Link href="/interview" className="btn-primary inline-flex">
            Start mock session →
          </Link>
        </div>
      )}
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
    <div className="glass rounded-2xl p-5">
      <h3 className={`mb-3 font-semibold ${accent ? "text-amber-400" : "text-white"}`}>
        {title}
      </h3>
      <ul className="space-y-1.5 text-sm text-slate-300">
        {items.map((i) => (
          <li key={i}>• {i}</li>
        ))}
      </ul>
    </div>
  );
}
