import { NextResponse } from "next/server";
import { gradeSolution } from "@/lib/dsa";

export async function POST(request: Request) {
  try {
    const { problemId, code } = (await request.json()) as {
      problemId: string;
      code: string;
    };
    if (!problemId || !code) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    const { score, feedback } = gradeSolution(problemId, code);
    return NextResponse.json({ score, feedback });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
