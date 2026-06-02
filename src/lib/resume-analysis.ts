import { completeJson } from "./llm";

export type ResumeReport = {
  overallScore: number;
  summary: string;
  detectedSkills: string[];
  missingSkills: string[];
  suggestedRoles: string[];
  projectTips: string[];
  interviewFocus: string[];
};

const SKILLS_WE_SCAN = [
  "javascript",
  "typescript",
  "react",
  "next",
  "node",
  "python",
  "java",
  "sql",
  "mongodb",
  "postgresql",
  "aws",
  "docker",
  "git",
  "html",
  "css",
  "tailwind",
  "express",
  "spring",
  "rest",
  "graphql",
  "redis",
  "kubernetes",
];

const STACK_BY_TRACK: Record<string, string[]> = {
  frontend: ["react", "javascript", "typescript", "html", "css", "tailwind"],
  backend: ["node", "sql", "postgresql", "java", "python", "rest"],
  fullstack: ["react", "node", "sql", "javascript", "typescript"],
  data: ["python", "sql", "machine learning"],
};

function scanResume(text: string, targetRole: string): ResumeReport {
  const lower = text.toLowerCase();
  const found = SKILLS_WE_SCAN.filter((s) => lower.includes(s));
  const track =
    Object.entries(STACK_BY_TRACK).find(([k]) => targetRole.toLowerCase().includes(k))?.[1] ??
    STACK_BY_TRACK.fullstack;
  const gaps = track.filter((s) => !found.includes(s));

  const words = text.split(/\s+/).filter(Boolean).length;
  const hasProjects = /project|built|developed|implemented|github/i.test(text);
  const hasNumbers = /\d+%|\d+\+|\d+\s*(users|ms|sec)/i.test(text);

  let overallScore = 50 + found.length * 4 + (hasProjects ? 12 : 0) + (hasNumbers ? 10 : 0);
  if (words > 250 && words < 900) overallScore += 8;
  if (words < 120) overallScore -= 15;
  overallScore = Math.min(92, Math.max(35, overallScore));

  return {
    overallScore,
    summary:
      overallScore >= 75
        ? "Resume reads well. Push harder on impact lines and keywords for the role you want."
        : overallScore >= 60
          ? "Decent base — quantify projects and mirror the job description vocabulary."
          : "Add a tight summary, skills block, and 2 projects with stack + outcome.",
    detectedSkills: found.length ? found : ["No skills section detected"],
    missingSkills: gaps.length ? gaps : ["Depth looks OK for now"],
    suggestedRoles: [
      found.includes("react") ? "Frontend engineer" : "Software engineer",
      found.includes("python") ? "Backend / data" : "Full-stack engineer",
    ],
    projectTips: [
      hasNumbers
        ? "You already use numbers — repeat that pattern on every bullet."
        : "Each project bullet: action + tech + outcome (%, time saved, scale).",
      hasProjects
        ? "Put repo or demo links inline."
        : "Two projects beat five vague one-liners.",
    ],
    interviewFocus: [
      `Rehearse ${targetRole} basics and two project walkthroughs`,
      gaps.length ? `Brush up: ${gaps.slice(0, 3).join(", ")}` : "Prep 3 behavioral stories (STAR)",
      "Run a mock round weekly and fix what the report flags",
    ],
  };
}

export async function analyzeResume(
  resumeText: string,
  candidateName: string,
  targetRole: string,
): Promise<ResumeReport> {
  const remote = await completeJson<ResumeReport>(
    `Review this resume for software roles. JSON only:
{"overallScore":0,"summary":"","detectedSkills":[],"missingSkills":[],"suggestedRoles":[],"projectTips":[],"interviewFocus":[]}`,
    `Name: ${candidateName}\nTarget: ${targetRole}\n\n${resumeText.slice(0, 6000)}`,
  );

  return remote ?? scanResume(resumeText, targetRole);
}
