"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { getSession, saveSession } from "@/lib/storage";
import type { InterviewSession } from "@/lib/types";

export default function InterviewSessionPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(180);

  useEffect(() => {
    const s = getSession(id);
    if (!s || s.status === "completed") {
      if (s?.status === "completed") router.replace(`/results/${id}`);
      else if (!s) setSession(null);
      return;
    }
    setSession(s);
    const existing = s.answers.reduce(
      (acc, a) => ({ ...acc, [a.questionId]: a.answer }),
      {} as Record<string, string>,
    );
    setAnswers(existing);
  }, [id, router]);

  const current = session?.questions[index];
  const total = session?.questions.length ?? 0;
  const isLast = index === total - 1;
  const timedMode = session?.config.timedMode ?? false;

  useEffect(() => {
    if (!timedMode || !current) return;
    setSecondsLeft(180);
    const t = setInterval(() => {
      setSecondsLeft((s) => (s <= 1 ? 0 : s - 1));
    }, 1000);
    return () => clearInterval(t);
  }, [index, timedMode, current?.id]);

  const persistAnswer = useCallback(
    (questionId: string, text: string) => {
      setAnswers((prev) => ({ ...prev, [questionId]: text }));
    },
    [],
  );

  useEffect(() => {
    if (current) setAnswer(answers[current.id] ?? "");
  }, [current, answers]);

  function goNext() {
    if (!current) return;
    persistAnswer(current.id, answer);
    if (!isLast) setIndex((i) => i + 1);
  }

  function goPrev() {
    if (!current) return;
    persistAnswer(current.id, answer);
    if (index > 0) setIndex((i) => i - 1);
  }

  async function finishInterview() {
    if (!session || !current) return;
    persistAnswer(current.id, answer);
    setSubmitting(true);

    const payload = session.questions.map((q) => ({
      questionId: q.id,
      answer: (q.id === current.id ? answer : answers[q.id]) ?? "",
    }));

    try {
      const res = await fetch("/api/interview/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          config: session.config,
          questions: session.questions,
          answers: payload,
        }),
      });
      if (!res.ok) throw new Error("Evaluation failed");
      const result = await res.json();

      const completed: InterviewSession = {
        ...session,
        answers: result.records,
        status: "completed",
        overallScore: result.overallScore,
        summary: result.summary,
        strengths: result.strengths,
        improvements: result.improvements,
        completedAt: new Date().toISOString(),
      };
      saveSession(completed);
      fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(completed),
      }).catch(() => {});
      router.push(`/results/${session.id}`);
    } catch {
      alert("Could not evaluate answers. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (session === null) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <p className="mb-4 text-slate-400">Session not found or expired.</p>
        <Link href="/interview" className="btn-primary">
          Start new interview
        </Link>
      </div>
    );
  }

  if (!current) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="mb-6 flex items-center justify-between text-sm text-slate-400">
        <span>
          Question {index + 1} of {total}
        </span>
        <div className="flex items-center gap-2">
          {timedMode && (
            <span
              className={`rounded-full px-3 py-1 font-mono text-xs font-bold ${
                secondsLeft < 30
                  ? "bg-red-500/20 text-red-400"
                  : "bg-amber-500/20 text-amber-300"
              }`}
            >
              {Math.floor(secondsLeft / 60)}:{String(secondsLeft % 60).padStart(2, "0")}
            </span>
          )}
          <span className="rounded-full bg-indigo-500/20 px-3 py-1 text-indigo-300">
            {current.category}
          </span>
        </div>
      </div>

      <div className="mb-2 h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-indigo-500 transition-all"
          style={{ width: `${((index + 1) / total) * 100}%` }}
        />
      </div>

      <div className="glass mt-8 rounded-2xl p-6 sm:p-8">
        <h2 className="mb-4 text-xl font-semibold leading-snug text-white sm:text-2xl">
          {current.text}
        </h2>
        {current.hint && (
          <p className="mb-6 text-sm text-slate-500">Tip: {current.hint}</p>
        )}

        <label className="label" htmlFor="answer">
          Your answer
        </label>
        <textarea
          id="answer"
          rows={8}
          className="input-field resize-y"
          placeholder="Type your answer as you would speak in an interview…"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
        />
        <p className="mt-2 text-xs text-slate-500">
          {answer.trim().split(/\s+/).filter(Boolean).length} words · Aim for 150–250
          words per question
        </p>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <button
          type="button"
          className="btn-secondary"
          onClick={goPrev}
          disabled={index === 0}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </button>

        {!isLast ? (
          <button type="button" className="btn-primary" onClick={goNext}>
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="button"
            className="btn-primary"
            onClick={finishInterview}
            disabled={submitting || answer.trim().length < 10}
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Evaluating…
              </>
            ) : (
              "Submit & get feedback"
            )}
          </button>
        )}
      </div>
    </div>
  );
}
