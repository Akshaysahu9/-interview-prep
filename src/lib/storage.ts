import type { InterviewSession } from "./types";

const STORAGE_KEY = "ai-mock-interview-sessions";

export function getSessions(): InterviewSession[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as InterviewSession[]) : [];
  } catch {
    return [];
  }
}

export function saveSession(session: InterviewSession): void {
  const existing = getSessions();
  const idx = existing.findIndex((s) => s.id === session.id);
  if (idx >= 0) existing[idx] = session;
  else existing.unshift(session);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing.slice(0, 20)));
}

export function getSession(id: string): InterviewSession | undefined {
  return getSessions().find((s) => s.id === id);
}
