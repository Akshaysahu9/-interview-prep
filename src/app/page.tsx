import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Building2,
  CheckCircle2,
  Code2,
  FileText,
  MessageSquare,
} from "lucide-react";
import { FeatureCard } from "@/components/FeatureCard";
import { app } from "@/lib/config";

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="border-b border-zinc-200 bg-white">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
          <div>
            <p className="section-label mb-4">Interview preparation</p>
            <h1 className="mb-5 text-4xl font-semibold leading-tight tracking-tight text-zinc-900 sm:text-5xl">
              Practice like it&apos;s the real round.
            </h1>
            <p className="mb-8 max-w-lg text-base leading-relaxed text-zinc-500">
              {app.name} runs structured mock interviews, reviews your resume against
              target roles, and tracks your scores over time — so you know exactly
              what to fix before the actual call.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/interview" className="btn-accent px-5 py-2.5">
                Start mock interview
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/resume" className="btn-secondary px-5 py-2.5">
                Review resume
              </Link>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-zinc-500">
              {["No signup required", "Sessions saved locally", "Detailed feedback"].map(
                (item) => (
                  <li key={item} className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-teal-600" strokeWidth={2} />
                    {item}
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* Product preview mockup */}
          <div className="relative hidden lg:block">
            <div className="card-raised overflow-hidden">
              <div className="flex items-center gap-2 border-b border-zinc-100 bg-zinc-50 px-4 py-2.5">
                <div className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-zinc-300" />
                  <span className="h-2.5 w-2.5 rounded-full bg-zinc-300" />
                  <span className="h-2.5 w-2.5 rounded-full bg-zinc-300" />
                </div>
                <span className="ml-2 text-xs text-zinc-400">Session report</span>
              </div>
              <div className="p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-zinc-400">Overall score</p>
                    <p className="text-3xl font-semibold tabular-nums text-zinc-900">
                      78<span className="text-lg text-zinc-400">/100</span>
                    </p>
                  </div>
                  <span className="badge badge-success">Full Stack · Junior</span>
                </div>
                <div className="mb-4 space-y-2">
                  {[
                    { q: "Explain event loop in Node.js", score: 82 },
                    { q: "Design a URL shortener", score: 74 },
                    { q: "Tell me about a conflict at work", score: 79 },
                  ].map((row) => (
                    <div
                      key={row.q}
                      className="flex items-center justify-between rounded-md bg-zinc-50 px-3 py-2"
                    >
                      <span className="truncate text-xs text-zinc-600">{row.q}</span>
                      <span className="ml-3 shrink-0 text-xs font-medium tabular-nums text-zinc-900">
                        {row.score}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="rounded-md border border-teal-100 bg-teal-50 px-3 py-2.5">
                  <p className="text-xs font-medium text-teal-800">Key improvement</p>
                  <p className="mt-0.5 text-xs text-teal-700">
                    Add time/space complexity when discussing solutions.
                  </p>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-4 -left-4 card px-4 py-3 shadow-lg">
              <p className="text-xs text-zinc-400">Last 5 sessions avg.</p>
              <p className="text-lg font-semibold tabular-nums text-zinc-900">+12 pts</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="page-body py-16">
        <div className="mb-10">
          <p className="section-label mb-2">Workflow</p>
          <h2 className="text-2xl font-semibold text-zinc-900">Four steps, one loop</h2>
        </div>
        <div className="grid gap-8 sm:grid-cols-2">
          <FeatureCard
            number="01"
            icon={FileText}
            title="Review your resume"
            description="Paste your resume and get a fit score, missing skills, and project tips aligned to your target role."
          />
          <FeatureCard
            number="02"
            icon={Code2}
            title="Sharpen coding fundamentals"
            description="Work through curated DSA problems with hints. Submit solutions and get feedback on approach and complexity."
          />
          <FeatureCard
            number="03"
            icon={MessageSquare}
            title="Run a mock interview"
            description="Role- and company-specific questions with optional timed rounds. Answer like you would on a real call."
          />
          <FeatureCard
            number="04"
            icon={BarChart3}
            title="Read the report, repeat"
            description="Per-question scores, strengths, and improvement areas. Track trends across sessions on your progress page."
          />
        </div>
      </section>

      {/* Features grid */}
      <section className="border-y border-zinc-200 bg-white py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-10 max-w-xl">
            <p className="section-label mb-2">Built for prep</p>
            <h2 className="text-2xl font-semibold text-zinc-900">
              Everything you need before the call
            </h2>
            <p className="mt-2 text-sm text-zinc-500">
              Not a chatbot wrapper — a structured workflow with persistent sessions and
              downloadable reports.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                icon: Building2,
                title: "Company profiles",
                desc: "Question styles tuned for product companies, enterprises, and startups.",
              },
              {
                icon: MessageSquare,
                title: "Mixed round types",
                desc: "Technical, behavioral, system design, or mixed — pick what you're preparing for.",
              },
              {
                icon: BarChart3,
                title: "Session history",
                desc: "All interviews saved locally with scores, summaries, and full question breakdowns.",
              },
            ].map((f) => (
              <div key={f.title} className="card p-5">
                <f.icon className="mb-3 h-5 w-5 text-teal-600" strokeWidth={1.75} />
                <h3 className="mb-1 text-sm font-semibold text-zinc-900">{f.title}</h3>
                <p className="text-sm leading-relaxed text-zinc-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="page-body py-16">
        <div className="card flex flex-col items-start justify-between gap-6 p-8 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-semibold text-zinc-900">
              Ready for your next round?
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Takes about 20 minutes. You&apos;ll get a full report at the end.
            </p>
          </div>
          <Link href="/interview" className="btn-accent shrink-0">
            Start mock interview
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
