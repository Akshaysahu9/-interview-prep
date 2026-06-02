import { completeJson } from "./llm";
import type { AnswerRecord, InterviewConfig, QuestionItem } from "./types";

export type InterviewGrade = {
  records: AnswerRecord[];
  overallScore: number;
  summary: string;
  strengths: string[];
  improvements: string[];
};

const ROLE_KEYWORDS: Record<string, string[]> = {
  frontend: ["react", "component", "performance", "accessibility", "css", "state"],
  backend: ["api", "database", "cache", "latency", "scale", "transaction"],
  fullstack: ["api", "frontend", "deploy", "auth", "database", "user"],
  data: ["model", "metric", "feature", "bias", "pipeline", "experiment"],
  product: ["metric", "user", "stakeholder", "priority", "roadmap", "outcome"],
  general: ["algorithm", "debug", "test", "design", "team", "trade-off"],
};

function lengthScore(text: string): number {
  const n = text.trim().length;
  if (n < 20) return 35;
  if (n < 80) return 55;
  if (n < 200) return 72;
  return 80;
}

function keywordBonus(text: string, role: string): number {
  const words = ROLE_KEYWORDS[role] ?? ROLE_KEYWORDS.general;
  const hits = words.filter((w) => text.toLowerCase().includes(w)).length;
  return hits * 4;
}

function hasConcreteDetail(text: string): boolean {
  return (
    /\b(first|then|finally|because|result)\b/i.test(text) ||
    /\d+%|\d+\s*(ms|sec|users|requests)/i.test(text)
  );
}

function noteFor(score: number, category: string): string {
  if (score >= 85) return `Strong ${category.toLowerCase()} — clear and specific.`;
  if (score >= 70) return "Good structure. Tie it to one metric or trade-off you owned.";
  if (score >= 55) return "Outline situation → what you did → outcome. Add one number if you can.";
  return "Too thin. State the problem, your steps, and what changed because of your work.";
}

function gradeLocally(
  config: InterviewConfig,
  questions: QuestionItem[],
  answers: { questionId: string; answer: string }[],
): InterviewGrade {
  const records = questions.map((q) => {
    const answer = answers.find((a) => a.questionId === q.id)?.answer ?? "";
    const trimmed = answer.trim();
    let score =
      lengthScore(trimmed) + keywordBonus(trimmed, config.role) + (hasConcreteDetail(trimmed) ? 8 : 0);
    score = Math.min(95, Math.max(40, score));

    return {
      questionId: q.id,
      question: q.text,
      answer,
      score,
      feedback: noteFor(score, q.category),
    };
  });

  const overallScore = Math.round(
    records.reduce((sum, r) => sum + r.score, 0) / Math.max(records.length, 1),
  );

  const strengths: string[] = [];
  const improvements: string[] = [];
  const avgChars = records.reduce((s, r) => s + r.answer.length, 0) / records.length;

  if (overallScore >= 75) {
    strengths.push("Answers stay on topic across the round");
    strengths.push("Vocabulary matches the role you picked");
  } else {
    improvements.push("Behavioral answers need a clearer situation and result");
  }

  if (avgChars < 120) {
    improvements.push("Most answers are short — aim for 90–120 seconds spoken length");
  } else {
    strengths.push("Enough detail without rambling");
  }

  if (records.some((r) => r.score < 60)) {
    improvements.push("Re-do the lowest-scored question out loud, then rewrite");
  }

  const name = config.candidateName;
  const summary =
    overallScore >= 80
      ? `${name}, this round is in good shape. Drill system design or depth where you hesitated.`
      : overallScore >= 65
        ? `${name}, you're close — tighten 2 answers with numbers and ownership.`
        : `${name}, keep iterating: context, your action, measurable result — every time.`;

  return { records, overallScore, summary, strengths, improvements };
}

type RemoteGrade = {
  perQuestion: { index: number; score: number; feedback: string }[];
  overallScore: number;
  summary: string;
  strengths: string[];
  improvements: string[];
};

export async function gradeInterview(
  config: InterviewConfig,
  questions: QuestionItem[],
  answers: { questionId: string; answer: string }[],
): Promise<InterviewGrade> {
  const payload = questions.map((q, i) => ({
    index: i + 1,
    question: q.text,
    category: q.category,
    answer: answers.find((a) => a.questionId === q.id)?.answer ?? "",
  }));

  const remote = await completeJson<RemoteGrade>(
    `Score each interview answer 0-100. Reply with JSON only:
{"perQuestion":[{"index":1,"score":0,"feedback":""}],"overallScore":0,"summary":"","strengths":[],"improvements":[]}`,
    `Role: ${config.role}, level: ${config.level}, format: ${config.type}
Candidate: ${config.candidateName}
${JSON.stringify(payload)}`,
  );

  if (!remote) return gradeLocally(config, questions, answers);

  const records = questions.map((q, i) => {
    const row = remote.perQuestion.find((p) => p.index === i + 1);
    const answer = answers.find((a) => a.questionId === q.id)?.answer ?? "";
    return {
      questionId: q.id,
      question: q.text,
      answer,
      score: row?.score ?? 60,
      feedback: row?.feedback ?? noteFor(60, q.category),
    };
  });

  return {
    records,
    overallScore: remote.overallScore,
    summary: remote.summary,
    strengths: remote.strengths ?? [],
    improvements: remote.improvements ?? [],
  };
}
