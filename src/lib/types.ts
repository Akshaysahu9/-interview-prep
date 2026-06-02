export type InterviewRole =
  | "frontend"
  | "backend"
  | "fullstack"
  | "data"
  | "product"
  | "general";

export type InterviewType = "technical" | "behavioral" | "mixed";
export type ExperienceLevel = "junior" | "mid" | "senior";
export type CompanyPack =
  | "general"
  | "product_mnc"
  | "service"
  | "startup"
  | "faang";

export interface InterviewConfig {
  role: InterviewRole;
  type: InterviewType;
  level: ExperienceLevel;
  candidateName: string;
  jobTitle?: string;
  company?: CompanyPack;
  timedMode?: boolean;
}

export interface QuestionItem {
  id: string;
  text: string;
  category: string;
  hint?: string;
}

export interface AnswerRecord {
  questionId: string;
  question: string;
  answer: string;
  score: number;
  feedback: string;
}

export interface InterviewSession {
  id: string;
  config: InterviewConfig;
  questions: QuestionItem[];
  answers: AnswerRecord[];
  status: "in_progress" | "completed";
  overallScore: number;
  summary: string;
  strengths: string[];
  improvements: string[];
  createdAt: string;
  completedAt?: string;
}

export const ROLE_LABELS: Record<InterviewRole, string> = {
  frontend: "Frontend Developer",
  backend: "Backend Developer",
  fullstack: "Full Stack Developer",
  data: "Data / ML Engineer",
  product: "Product Manager",
  general: "General Software",
};

export const TYPE_LABELS: Record<InterviewType, string> = {
  technical: "Technical",
  behavioral: "Behavioral",
  mixed: "Mixed",
};

export const LEVEL_LABELS: Record<ExperienceLevel, string> = {
  junior: "Junior (0–2 yrs)",
  mid: "Mid (2–5 yrs)",
  senior: "Senior (5+ yrs)",
};
