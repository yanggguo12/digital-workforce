import React from 'react';
import { cn } from '@/src/lib/utils';

interface StatusBadgeProps {
  confidence: number;
}

export function StatusBadge({ confidence }: StatusBadgeProps) {
  const getStyle = () => {
    if (confidence >= 90) return "bg-green-100 text-green-700 border-green-200";
    if (confidence >= 70) return "bg-orange-100 text-orange-700 border-orange-200";
    return "bg-red-100 text-red-700 border-red-200";
  };

  const getLabel = () => {
    if (confidence >= 90) return "高置信度";
    if (confidence >= 70) return "需人工审核";
    return "手动录入";
  };

  return (
    <div className={cn(
      "px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wide inline-flex items-center gap-1",
      getStyle()
    )}>
      <span className={cn("w-1 h-1 rounded-full", confidence >= 90 ? "bg-green-500" : confidence >= 70 ? "bg-orange-500" : "bg-red-500")} />
      {getLabel()} ({confidence}%)
    </div>
  );
}
