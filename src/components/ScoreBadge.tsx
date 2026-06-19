import type { CSSProperties } from "react";

interface ScoreBadgeProps {
  score: number;
  size?: "sm" | "lg";
}

function scoreColor(score: number): string {
  if (score >= 80) return "#059669";
  if (score >= 65) return "#d97706";
  return "#dc2626";
}

export function ScoreBadge({ score, size = "sm" }: ScoreBadgeProps) {
  const dim = size === "lg" ? "h-24 w-24 text-2xl" : "h-11 w-11 text-xs";
  return (
    <div
      className={`score-ring flex items-center justify-center rounded-full font-semibold text-zinc-900 ${dim}`}
      style={
        {
          "--score": score,
          "--score-color": scoreColor(score),
        } as CSSProperties
      }
    >
      <span className="flex h-[88%] w-[88%] items-center justify-center rounded-full bg-white text-zinc-900">
        {score}
      </span>
    </div>
  );
}
