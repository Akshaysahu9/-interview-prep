import type { CSSProperties } from "react";

interface ScoreBadgeProps {
  score: number;
  size?: "sm" | "lg";
}

function scoreColor(score: number): string {
  if (score >= 80) return "#22c55e";
  if (score >= 65) return "#eab308";
  return "#f97316";
}

export function ScoreBadge({ score, size = "sm" }: ScoreBadgeProps) {
  const dim = size === "lg" ? "h-28 w-28 text-3xl" : "h-12 w-12 text-sm";
  return (
    <div
      className={`score-ring flex items-center justify-center rounded-full font-bold text-white ${dim}`}
      style={
        {
          "--score": score,
          "--score-color": scoreColor(score),
        } as CSSProperties
      }
    >
      <span className="flex h-[85%] w-[85%] items-center justify-center rounded-full bg-slate-900">
        {score}
      </span>
    </div>
  );
}
