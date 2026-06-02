interface ProgressChartProps {
  scores: { label: string; score: number }[];
}

export function ProgressChart({ scores }: ProgressChartProps) {
  if (!scores.length) {
    return (
      <p className="text-center text-sm text-slate-500">Complete interviews to see progress.</p>
    );
  }

  const max = 100;

  return (
    <div className="flex h-48 items-end justify-between gap-2 sm:gap-3">
      {scores.map((s) => (
        <div key={s.label} className="flex flex-1 flex-col items-center gap-2">
          <span className="text-xs font-semibold text-indigo-300">{s.score}%</span>
          <div className="flex w-full flex-1 items-end">
            <div
              className="w-full rounded-t-lg bg-gradient-to-t from-indigo-600 to-violet-500 transition-all"
              style={{ height: `${(s.score / max) * 100}%`, minHeight: "8px" }}
            />
          </div>
          <span className="max-w-[4rem] truncate text-center text-[10px] text-slate-500">
            {s.label}
          </span>
        </div>
      ))}
    </div>
  );
}
