import { prisma } from "./db";
import type { InterviewSession } from "./types";

function rowToSession(r: {
  id: string;
  candidateName: string;
  role: string;
  type: string;
  level: string;
  company: string;
  jobTitle: string | null;
  status: string;
  overallScore: number;
  summary: string;
  strengths: string;
  improvements: string;
  questions: string;
  answers: string;
  createdAt: Date;
  completedAt: Date | null;
}): InterviewSession {
  return {
    id: r.id,
    config: {
      candidateName: r.candidateName,
      role: r.role as InterviewSession["config"]["role"],
      type: r.type as InterviewSession["config"]["type"],
      level: r.level as InterviewSession["config"]["level"],
      company: r.company as InterviewSession["config"]["company"],
      jobTitle: r.jobTitle ?? undefined,
    },
    questions: JSON.parse(r.questions),
    answers: JSON.parse(r.answers),
    status: r.status as InterviewSession["status"],
    overallScore: r.overallScore,
    summary: r.summary,
    strengths: JSON.parse(r.strengths),
    improvements: JSON.parse(r.improvements),
    createdAt: r.createdAt.toISOString(),
    completedAt: r.completedAt?.toISOString(),
  };
}

export async function saveInterview(session: InterviewSession) {
  try {
    await prisma.interview.upsert({
      where: { id: session.id },
      create: {
        id: session.id,
        candidateName: session.config.candidateName,
        role: session.config.role,
        type: session.config.type,
        level: session.config.level,
        company: session.config.company ?? "general",
        jobTitle: session.config.jobTitle,
        status: session.status,
        overallScore: session.overallScore,
        summary: session.summary,
        strengths: JSON.stringify(session.strengths),
        improvements: JSON.stringify(session.improvements),
        questions: JSON.stringify(session.questions),
        answers: JSON.stringify(session.answers),
        createdAt: new Date(session.createdAt),
        completedAt: session.completedAt ? new Date(session.completedAt) : null,
      },
      update: {
        status: session.status,
        overallScore: session.overallScore,
        summary: session.summary,
        strengths: JSON.stringify(session.strengths),
        improvements: JSON.stringify(session.improvements),
        answers: JSON.stringify(session.answers),
        completedAt: session.completedAt ? new Date(session.completedAt) : null,
      },
    });
  } catch {
    /* db optional during local setup */
  }
}

export async function fetchInterviews(name?: string): Promise<InterviewSession[]> {
  try {
    const rows = await prisma.interview.findMany({
      where: name ? { candidateName: { contains: name } } : undefined,
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return rows.map(rowToSession);
  } catch {
    return [];
  }
}
