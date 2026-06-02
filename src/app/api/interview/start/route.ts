import { NextResponse } from "next/server";
import { buildQuestionSet } from "@/lib/questions";
import { saveInterview } from "@/lib/interviews";
import type { InterviewConfig, InterviewSession } from "@/lib/types";
import { generateId } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as InterviewConfig;

    if (!body.candidateName?.trim() || !body.role || !body.type || !body.level) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const questions = buildQuestionSet(
      body.role,
      body.type,
      body.level,
      body.company ?? "general",
    );
    const session: InterviewSession = {
      id: generateId(),
      config: {
        ...body,
        candidateName: body.candidateName.trim(),
        company: body.company ?? "general",
      },
      questions,
      answers: [],
      status: "in_progress" as const,
      overallScore: 0,
      summary: "",
      strengths: [],
      improvements: [],
      createdAt: new Date().toISOString(),
    };

    await saveInterview(session);
    return NextResponse.json(session);
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
