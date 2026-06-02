import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { analyzeResume } from "@/lib/resume-analysis";
import { generateId } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      candidateName: string;
      targetRole: string;
      resumeText: string;
    };

    if (!body.resumeText?.trim() || !body.candidateName?.trim()) {
      return NextResponse.json({ error: "Name and resume text required" }, { status: 400 });
    }

    const result = await analyzeResume(
      body.resumeText.trim(),
      body.candidateName.trim(),
      body.targetRole || "Full Stack Developer",
    );

    const id = generateId();
    try {
      await prisma.resumeAnalysis.create({
        data: {
          id,
          candidateName: body.candidateName.trim(),
          resumeText: body.resumeText.slice(0, 10000),
          result: JSON.stringify(result),
        },
      });
    } catch {
      // DB optional until prisma db push
    }

    return NextResponse.json({ id, result });
  } catch {
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
  }
}
