import Link from "next/link";
import {
  BarChart3,
  Building2,
  Code2,
  FileText,
  LineChart,
  MessageSquare,
  Shield,
} from "lucide-react";
import { FeatureCard } from "@/components/FeatureCard";
import { app } from "@/lib/config";

export default function HomePage() {
  return (
    <div>
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 text-sm font-medium tracking-wide text-indigo-400 uppercase">
            Interview preparation platform
          </p>
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Walk into every round{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              prepared
            </span>
          </h1>
          <p className="mb-10 text-lg leading-relaxed text-slate-400">
            {app.name} combines realistic mock interviews, resume review, coding practice,
            and session analytics — so you can improve with clear, actionable feedback.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/interview" className="btn-primary px-8 py-3 text-base">
              Start a session
            </Link>
            <Link href="/resume" className="btn-secondary px-8 py-3 text-base">
              Review resume
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-4">
          {[
            { n: "4", l: "Integrated tools" },
            { n: "6", l: "Role profiles" },
            { n: "5", l: "Company styles" },
            { n: "100%", l: "Private sessions" },
          ].map((s) => (
            <div key={s.l} className="glass rounded-xl py-4 text-center">
              <p className="text-2xl font-bold text-white">{s.n}</p>
              <p className="text-xs text-slate-500">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <h2 className="mb-3 text-center text-2xl font-bold text-white">
          Everything in one workflow
        </h2>
        <p className="mx-auto mb-10 max-w-xl text-center text-slate-400">
          From resume to coding to the live mock — each step feeds the next.
        </p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            icon={MessageSquare}
            title="Mock interviews"
            description="Role- and company-aligned questions with timed rounds and detailed per-answer feedback."
          />
          <FeatureCard
            icon={FileText}
            title="Resume review"
            description="Surface skill gaps, strengthen project bullets, and align your profile to target roles."
          />
          <FeatureCard
            icon={Code2}
            title="Coding practice"
            description="Curated problems with hints and structured feedback on your approach and complexity."
          />
          <FeatureCard
            icon={BarChart3}
            title="Progress tracking"
            description="Session history, score trends, and role-level breakdowns over time."
          />
          <FeatureCard
            icon={Building2}
            title="Company profiles"
            description="Interview patterns tuned for product companies, enterprises, startups, and high-growth teams."
          />
          <FeatureCard
            icon={Shield}
            title="Built for reliability"
            description="Persistent sessions, REST APIs, and a modern stack you can run locally or deploy to production."
          />
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 pb-24 sm:px-6">
        <div className="glass rounded-3xl p-10 text-center">
          <LineChart className="mx-auto mb-4 h-10 w-10 text-indigo-400" />
          <h2 className="mb-4 text-2xl font-bold text-white">A clear practice loop</h2>
          <p className="mb-8 text-slate-400">
            Review your resume → sharpen fundamentals → run a mock session → read your
            report → repeat until scores trend up.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/resume" className="btn-secondary">
              Resume
            </Link>
            <Link href="/dsa" className="btn-secondary">
              Coding
            </Link>
            <Link href="/interview" className="btn-primary">
              Mock interview
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
