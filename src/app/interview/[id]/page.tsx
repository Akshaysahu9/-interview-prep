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
      <div className="page-body py-20 text-center">
        <p className="mb-4 text-sm text-zinc-500">Session not found or expired.</p>
        <Link href="/interview" className="btn-accent">
          Start new interview
        </Link>
      </div>
    );
  }

  if (!current) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
      </div>
    );
  }

  const wordCount = answer.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div>
      {/* Session top bar */}
      <div className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-3xl px-4 py-4 sm:px-6">
          <div className="mb-3 flex items-center justify-between text-sm">
            <span className="font-medium text-zinc-700">
              Question {index + 1} of {total}
            </span>
            <div className="flex items-center gap-2">
              {timedMode && (
                <span
                  className={`badge font-mono tabular-nums ${
                    secondsLeft < 30 ? "bg-red-50 text-red-700 ring-red-600/20" : "badge-warning"
                  }`}
                >
                  {Math.floor(secondsLeft / 60)}:{String(secondsLeft % 60).padStart(2, "0")}
                </span>
              )}
              <span className="badge badge-info">{current.category}</span>
            </div>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-zinc-100">
            <div
              className="h-full rounded-full bg-teal-600 transition-all duration-300"
              style={{ width: `${((index + 1) / total) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="page-body">
        <div className="mx-auto max-w-3xl">
          <div className="card p-6 sm:p-8">
            <h2 className="mb-4 text-lg font-semibold leading-snug text-zinc-900 sm:text-xl">
              {current.text}
            </h2>
            {current.hint && (
              <p className="mb-6 rounded-md bg-zinc-50 px-3 py-2 text-xs text-zinc-500">
                Tip: {current.hint}
              </p>
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
            <p className="mt-2 text-xs text-zinc-400">
              {wordCount} words · Aim for 150–250 words per question
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
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
              <button type="button" className="btn-accent" onClick={goNext}>
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                className="btn-accent"
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
      </div>
    </div>
  );
}
