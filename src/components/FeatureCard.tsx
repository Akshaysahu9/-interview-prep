import type { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  number?: string;
}

export function FeatureCard({ icon: Icon, title, description, number }: FeatureCardProps) {
  return (
    <div className="group flex gap-4">
      <div className="flex shrink-0 flex-col items-center gap-2">
        {number && (
          <span className="text-xs font-mono font-medium text-zinc-300">{number}</span>
        )}
        <div className="flex h-10 w-10 items-center justify-center rounded-md border border-zinc-200 bg-zinc-50 text-zinc-700 transition-colors group-hover:border-teal-200 group-hover:bg-teal-50 group-hover:text-teal-700">
          <Icon className="h-4 w-4" strokeWidth={1.75} />
        </div>
      </div>
      <div>
        <h3 className="mb-1 text-sm font-semibold text-zinc-900">{title}</h3>
        <p className="text-sm leading-relaxed text-zinc-500">{description}</p>
      </div>
    </div>
  );
}
