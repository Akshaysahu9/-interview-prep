"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Clock, Loader2 } from "lucide-react";
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
    <div>
      <div className="page-header">
        <div className="page-header-inner">
          <p className="section-label mb-2">Mock Interview</p>
          <h1 className="text-2xl font-semibold text-zinc-900">Configure your session</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Questions adapt to your role, experience level, and target company style.
          </p>
        </div>
      </div>

      <div className="page-body">
        <div className="mx-auto max-w-xl">
          <form onSubmit={handleSubmit} className="card space-y-5 p-6 sm:p-8">
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
                Target role <span className="font-normal text-zinc-400">(optional)</span>
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
              <p className="mt-1.5 text-xs text-zinc-500">{COMPANY_TIPS[form.company]}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
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

            <label className="flex cursor-pointer items-center gap-3 rounded-md border border-zinc-200 bg-zinc-50 p-4">
              <input
                type="checkbox"
                checked={form.timedMode}
                onChange={(e) => setForm({ ...form, timedMode: e.target.checked })}
                className="h-4 w-4 rounded border-zinc-300 text-teal-600 focus:ring-teal-500"
              />
              <div className="flex items-center gap-2 text-sm text-zinc-700">
                <Clock className="h-4 w-4 text-zinc-400" />
                Timed rounds — 3 minutes per question
              </div>
            </label>

            {error && (
              <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
                {error}
              </p>
            )}

            <button type="submit" className="btn-accent w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Preparing questions…
                </>
              ) : (
                <>
                  Start interview
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
