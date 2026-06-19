interface ProgressChartProps {
  scores: { label: string; score: number }[];
}

export function ProgressChart({ scores }: ProgressChartProps) {
  if (!scores.length) {
    return (
      <div className="flex h-40 items-center justify-center rounded-md border border-dashed border-zinc-200 bg-zinc-50">
        <p className="text-sm text-zinc-400">Complete interviews to see your trend.</p>
      </div>
    );
  }

  return (
    <div className="flex h-44 items-end gap-3">
      {scores.map((s) => (
        <div key={s.label} className="flex flex-1 flex-col items-center gap-2">
          <span className="text-xs font-medium tabular-nums text-zinc-700">
            {s.score}%
          </span>
          <div className="flex w-full flex-1 flex-col justify-end rounded-sm bg-zinc-100">
            <div
              className="w-full rounded-sm bg-teal-600"
              style={{ height: `${Math.max(s.score, 4)}%` }}
            />
          </div>
          <span className="max-w-[3.5rem] truncate text-center text-[10px] font-medium text-zinc-400">
            {s.label}
          </span>
        </div>
      ))}
    </div>
  );
}
