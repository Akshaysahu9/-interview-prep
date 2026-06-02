import { NextResponse } from "next/server";
import { fetchInterviews, saveInterview } from "@/lib/interviews";
import type { InterviewSession } from "@/lib/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name") ?? undefined;
  const sessions = await fetchInterviews(name);
  return NextResponse.json({ sessions });
}

export async function POST(request: Request) {
  try {
    const session = (await request.json()) as InterviewSession;
    await saveInterview(session);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to save" }, { status: 400 });
  }
}
