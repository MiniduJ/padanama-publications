import * as React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { Button } from "./Button";

export interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 sm:p-12 bg-white/70 rounded-2xl border border-dashed border-maroon-200 max-w-md mx-auto my-6 space-y-4",
        className
      )}
    >
      <div className="w-16 h-16 rounded-full bg-maroon-50 text-maroon-700 flex items-center justify-center shadow-inner">
        <Icon className="w-8 h-8 text-maroon-700 stroke-[1.75]" />
      </div>

      <div className="space-y-1">
        <h3 className="font-display font-bold text-lg text-ink">{title}</h3>
        <p className="text-xs text-ink-muted leading-relaxed max-w-xs">{description}</p>
      </div>

      {actionLabel && onAction && (
        <Button variant="saffron" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
