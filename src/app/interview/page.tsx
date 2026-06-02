"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { COMPANY_LABELS, COMPANY_TIPS } from "@/lib/companies";
import {
  LEVEL_LABELS,
  ROLE_LABELS,
  TYPE_LABELS,
  type CompanyPack,
  type ExperienceLevel,
  type InterviewRole,
  type InterviewType,
} from "@/lib/types";
import { saveSession } from "@/lib/storage";
import type { InterviewSession } from "@/lib/types";

export default function InterviewSetupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    candidateName: "",
    jobTitle: "",
    role: "fullstack" as InterviewRole,
    type: "mixed" as InterviewType,
    level: "junior" as ExperienceLevel,
    company: "general" as CompanyPack,
    timedMode: true,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.candidateName.trim()) {
      setError("Please enter your name.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/interview/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to start session");
      const session = (await res.json()) as InterviewSession;
      saveSession(session);
      router.push(`/interview/${session.id}`);
    } catch {
      setError("Could not start interview. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-12 sm:px-6">
      <h1 className="mb-2 text-3xl font-bold text-white">Schedule a mock interview</h1>
      <p className="mb-8 text-slate-400">
        Questions adapt to your role, experience level, and target company style.
      </p>

      <form onSubmit={handleSubmit} className="glass space-y-5 rounded-2xl p-6 sm:p-8">
        <div>
          <label className="label" htmlFor="name">
            Your name
          </label>
          <input
            id="name"
            className="input-field"
            placeholder="Akshay Sahu"
            value={form.candidateName}
            onChange={(e) => setForm({ ...form, candidateName: e.target.value })}
          />
        </div>

        <div>
          <label className="label" htmlFor="job">
            Target role (optional)
          </label>
          <input
            id="job"
            className="input-field"
            placeholder="e.g. SDE-1 at Amazon"
            value={form.jobTitle}
            onChange={(e) => setForm({ ...form, jobTitle: e.target.value })}
          />
        </div>

        <div>
          <label className="label" htmlFor="company">
            Company profile
          </label>
          <select
            id="company"
            className="input-field"
            value={form.company}
            onChange={(e) =>
              setForm({ ...form, company: e.target.value as CompanyPack })
            }
          >
            {Object.entries(COMPANY_LABELS).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
          <p className="mt-1.5 text-xs text-indigo-300/80">{COMPANY_TIPS[form.company]}</p>
        </div>

        <div>
          <label className="label" htmlFor="role">
            Interview track
          </label>
          <select
            id="role"
            className="input-field"
            value={form.role}
            onChange={(e) =>
              setForm({ ...form, role: e.target.value as InterviewRole })
            }
          >
            {Object.entries(ROLE_LABELS).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label" htmlFor="type">
            Interview type
          </label>
          <select
            id="type"
            className="input-field"
            value={form.type}
            onChange={(e) =>
              setForm({ ...form, type: e.target.value as InterviewType })
            }
          >
            {Object.entries(TYPE_LABELS).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label" htmlFor="level">
            Experience level
          </label>
          <select
            id="level"
            className="input-field"
            value={form.level}
            onChange={(e) =>
              setForm({ ...form, level: e.target.value as ExperienceLevel })
            }
          >
            {Object.entries(LEVEL_LABELS).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </div>

        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-slate-900/50 p-4">
          <input
            type="checkbox"
            checked={form.timedMode}
            onChange={(e) => setForm({ ...form, timedMode: e.target.checked })}
            className="h-4 w-4 rounded border-slate-600"
          />
          <span className="text-sm text-slate-300">
            Timed rounds — 3 minutes per question
          </span>
        </label>

        {error && (
          <p className="text-sm text-red-400" role="alert">
            {error}
          </p>
        )}

        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? "Preparing questions…" : "Start interview"}
        </button>
      </form>
    </div>
  );
}
