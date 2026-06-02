import { NextResponse } from "next/server";
import { gradeInterview } from "@/lib/scoring";
import type { InterviewConfig, QuestionItem } from "@/lib/types";

interface CompleteBody {
  config: InterviewConfig;
  questions: QuestionItem[];
  answers: { questionId: string; answer: string }[];
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CompleteBody;

    if (!body.config || !body.questions?.length || !body.answers) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const result = await gradeInterview(
      body.config,
      body.questions,
      body.answers,
    );

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Evaluation failed" }, { status: 500 });
  }
}
