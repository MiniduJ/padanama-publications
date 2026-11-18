import * as React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export interface RatingProps {
  value: number; // 0 to 5
  max?: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onChange?: (val: number) => void;
  className?: string;
}

export function Rating({
  value,
  max = 5,
  size = "md",
  interactive = false,
  onChange,
  className,
}: RatingProps) {
  const sizeClasses = {
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  return (
    <div
      className={cn("inline-flex items-center gap-0.5", className)}
      role={interactive ? "radiogroup" : "img"}
      aria-label={`${value} out of ${max} stars`}
    >
      {Array.from({ length: max }).map((_, i) => {
        const starValue = i + 1;
        const isFilled = starValue <= Math.round(value);

        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onChange?.(starValue)}
            className={cn(
              "text-gold-500 transition-transform",
              interactive && "hover:scale-110 cursor-pointer disabled:cursor-default"
            )}
            tabIndex={interactive ? 0 : -1}
          >
            <Star
              className={cn(
                sizeClasses[size],
                isFilled ? "fill-gold-500 text-gold-500" : "fill-transparent text-gray-300"
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
