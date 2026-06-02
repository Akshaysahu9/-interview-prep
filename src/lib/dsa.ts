export interface DsaProblem {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium";
  description: string;
  examples: string[];
  hints: string[];
  topics: string[];
}

export const DSA_PROBLEMS: DsaProblem[] = [
  {
    id: "two-sum",
    title: "Two Sum",
    difficulty: "Easy",
    description:
      "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. Assume exactly one solution.",
    examples: [
      "Input: nums = [2,7,11,15], target = 9 → Output: [0,1]",
      "Input: nums = [3,2,4], target = 6 → Output: [1,2]",
    ],
    hints: ["Use a hash map to store seen values.", "Time O(n), Space O(n)"],
    topics: ["Array", "Hash Map"],
  },
  {
    id: "valid-parentheses",
    title: "Valid Parentheses",
    difficulty: "Easy",
    description:
      'Given a string s containing only "(", ")", "{", "}", "[", "]", determine if the input string is valid.',
    examples: ['Input: "()" → true', 'Input: "(]" → false'],
    hints: ["Use a stack.", "Push opening brackets, pop on closing."],
    topics: ["Stack", "String"],
  },
  {
    id: "max-subarray",
    title: "Maximum Subarray (Kadane)",
    difficulty: "Medium",
    description:
      "Given an integer array nums, find the contiguous subarray with the largest sum and return that sum.",
    examples: ["Input: [-2,1,-3,4,-1,2,1,-5,4] → Output: 6", "Subarray [4,-1,2,1]"],
    hints: [
      "Kadane's algorithm: track current max ending here.",
      "Ask clarifying: empty array? all negative?",
    ],
    topics: ["Array", "DP"],
  },
];

export function gradeSolution(
  problemId: string,
  code: string,
): { score: number; feedback: string } {
  const lower = code.toLowerCase();
  const len = code.trim().length;

  if (len < 30) {
    return { score: 20, feedback: "Write at least pseudocode or approach before submitting." };
  }

  const checks: Record<string, string[]> = {
    "two-sum": ["map", "hash", "for", "target"],
    "valid-parentheses": ["stack", "push", "pop"],
    "max-subarray": ["max", "sum", "kadane", "current"],
  };

  const keys = checks[problemId] ?? ["for", "return"];
  const hits = keys.filter((k) => lower.includes(k)).length;
  const hasComplexity = /o\(|time|space/i.test(code);

  let score = 40 + hits * 12 + (hasComplexity ? 15 : 0);
  if (len > 200) score += 10;
  score = Math.min(95, score);

  const feedback =
    score >= 80
      ? "Looks reasonable — walk through edge cases and complexity next."
      : score >= 60
        ? "Partial approach. State brute force, then your optimized idea and Big-O."
        : "Start with how you'd explain it verbally before optimizing.";

  return { score, feedback };
}
