import { getCompanyQuestions } from "./companies";
import type {
  CompanyPack,
  ExperienceLevel,
  InterviewRole,
  InterviewType,
  QuestionItem,
} from "./types";
import { generateId } from "./utils";

const TECHNICAL: Record<InterviewRole, string[]> = {
  frontend: [
    "Explain the React rendering lifecycle and when you would use useMemo vs useCallback.",
    "How do you optimize Core Web Vitals (LCP, INP, CLS) on a production SPA?",
    "Describe how you would implement accessible form validation without hurting UX.",
    "What is the difference between SSR, SSG, and ISR in Next.js? When would you pick each?",
    "Walk through debugging a hydration mismatch in production.",
  ],
  backend: [
    "Design a rate-limited REST API for a high-traffic endpoint. What components would you use?",
    "Explain ACID vs BASE and when eventual consistency is acceptable.",
    "How do you prevent N+1 queries in an ORM-based service?",
    "Describe your approach to idempotency for payment webhooks.",
    "How would you debug elevated p99 latency after a deploy?",
  ],
  fullstack: [
    "Design a real-time notification system from DB to browser. Include failure modes.",
    "How do you structure a monorepo vs polyrepo for a small team shipping weekly?",
    "Explain auth choices: session cookies vs JWT. Trade-offs for a B2B SaaS.",
    "Describe a feature you shipped end-to-end. What would you do differently?",
    "How do you coordinate API versioning between frontend and backend teams?",
  ],
  data: [
    "Explain bias-variance tradeoff with a project example.",
    "How would you design a feature store for real-time ML inference?",
    "Describe handling data drift in a production model.",
    "Walk through evaluating a classification model beyond accuracy.",
    "How do you document and reproduce an experiment for stakeholders?",
  ],
  product: [
    "How do you prioritize a backlog when engineering capacity is fixed?",
    "Describe a time you said no to a stakeholder. What was the outcome?",
    "What metrics would you track for a new onboarding flow?",
    "How do you write acceptance criteria that engineers can implement?",
    "Tell me about a failed launch and what you learned.",
  ],
  general: [
    "Explain time complexity of common operations on arrays vs hash maps.",
    "How do you approach debugging an intermittent production bug?",
    "Describe SOLID principles with a concrete refactor example.",
    "What is your strategy for code reviews on a fast-moving team?",
    "How do you estimate tasks when requirements are ambiguous?",
  ],
};

const BEHAVIORAL: string[] = [
  "Tell me about a time you disagreed with a teammate. How did you resolve it?",
  "Describe a project where you missed a deadline. What happened and what changed?",
  "Give an example of learning a new technology quickly under pressure.",
  "Tell me about feedback that was hard to hear and how you applied it.",
  "Describe a situation where you had to influence without authority.",
];

function pick<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, arr.length));
}

export function buildQuestionSet(
  role: InterviewRole,
  type: InterviewType,
  level: ExperienceLevel,
  company: CompanyPack = "general",
): QuestionItem[] {
  const count = level === "senior" ? 5 : level === "mid" ? 4 : 3;
  const items: { text: string; category: string }[] = [];

  if (type === "technical" || type === "mixed") {
    pick(TECHNICAL[role], type === "mixed" ? Math.ceil(count / 2) : count).forEach(
      (text) => items.push({ text, category: "Technical" }),
    );
  }
  if (type === "behavioral" || type === "mixed") {
    const behavioralCount =
      type === "mixed" ? count - items.length : count;
    pick(BEHAVIORAL, behavioralCount).forEach((text) =>
      items.push({ text, category: "Behavioral" }),
    );
  }

  pick(getCompanyQuestions(company), 1).forEach((text) =>
    items.push({ text, category: "Company-specific" }),
  );

  return items.map((q) => ({
    id: generateId(),
    text: q.text,
    category: q.category,
    hint:
      level === "junior"
        ? "Use STAR format: Situation, Task, Action, Result."
        : "Be specific with metrics, trade-offs, and ownership.",
  }));
}
