import type { CompanyPack } from "./types";

export const COMPANY_LABELS: Record<CompanyPack, string> = {
  general: "Standard (mixed companies)",
  product_mnc: "Product MNC (Microsoft, Adobe…)",
  service: "Service (TCS, Infosys, Wipro…)",
  startup: "Startup / Mid-size product",
  faang: "High-growth (Amazon, Flipkart, Uber…)",
};

export const COMPANY_TIPS: Record<CompanyPack, string> = {
  general: "Balance DSA, projects, and communication.",
  product_mnc: "Emphasize system design basics, scalability, and clean code.",
  service: "Focus on fundamentals, SQL, OOP, and client communication.",
  startup: "Show ownership, fast shipping, and full-stack thinking.",
  faang: "Deep DSA, trade-offs, metrics, and leadership principles.",
};

const COMPANY_EXTRA: Record<CompanyPack, string[]> = {
  general: [
    "Why are you a strong fit for this role?",
    "Walk through a recent project end-to-end: problem, your contribution, and outcome.",
  ],
  product_mnc: [
    "How would you design a URL shortener with 10M daily active users?",
    "Describe a time you improved performance or reliability in a project.",
  ],
  service: [
    "Write SQL to find the second highest salary per department.",
    "Explain OOP pillars with a real class diagram from your project.",
  ],
  startup: [
    "You have 2 weeks to ship an MVP — how do you scope and cut features?",
    "Tell me about a bug you shipped and how you fixed it in production.",
  ],
  faang: [
    "Tell me about a time you dove deep to fix a critical customer issue.",
    "Design a rate limiter for an API — data structures and failure handling.",
  ],
};

export function getCompanyQuestions(company: CompanyPack): string[] {
  return COMPANY_EXTRA[company] ?? COMPANY_EXTRA.general;
}
