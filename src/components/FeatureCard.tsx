import type { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <div className="glass rounded-2xl p-6 transition hover:border-indigo-500/30">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600/20 text-indigo-400">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-white">{title}</h3>
      <p className="text-sm leading-relaxed text-slate-400">{description}</p>
    </div>
  );
}
