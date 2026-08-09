"use client";

import { TrendingUp } from "lucide-react";

interface MetricBadgeProps {
  value: string;
  color?: "green" | "cyan" | "purple";
}

export default function MetricBadge({
  value,
  color = "green",
}: MetricBadgeProps) {
  const colors = {
    green:
      "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
    cyan:
      "border-cyan-500/20 bg-cyan-500/10 text-cyan-300",
    purple:
      "border-purple-500/20 bg-purple-500/10 text-purple-300",
  };

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${colors[color]}`}
    >
      <TrendingUp className="h-3.5 w-3.5" />
      {value}
    </span>
  );
}