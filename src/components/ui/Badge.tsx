import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "maroon" | "saffron" | "green" | "gold" | "gray" | "outline" | "brandRed" | "brandYellow" | "brandNavy";
}

export function Badge({ className, variant = "maroon", children, ...props }: BadgeProps) {
  const variants = {
    maroon: "bg-maroon-100 text-maroon-900 border-maroon-200",
    saffron: "bg-saffron-100 text-saffron-900 border-saffron-200",
    green: "bg-green-50 text-green-700 border-green-200",
    gold: "bg-gold-50 text-ink border-gold-300 font-bold",
    gray: "bg-gray-100 text-gray-800 border-gray-200",
    outline: "border border-ink/20 text-ink bg-transparent",
    brandRed: "bg-brandRed text-white border-brandRed-700 font-bold shadow-sm",
    brandYellow: "bg-brandYellow text-brandNavy font-extrabold border-brandYellow-600 shadow-sm",
    brandNavy: "bg-brandNavy text-white font-semibold border-brandNavy-800 shadow-sm",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border transition-colors",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
