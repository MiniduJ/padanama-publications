import * as React from "react";
import { cn } from "@/lib/utils";

export interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export function Logo({ className, size = "md", showText = true }: LogoProps) {
  const sizeMap = {
    sm: "w-8 h-8 text-lg",
    md: "w-11 h-11 text-2xl",
    lg: "w-16 h-16 text-4xl",
  };

  return (
    <div className={cn("inline-flex items-center gap-3", className)}>
      <div
        className={cn(
          "rounded-2xl bg-gradient-to-br from-maroon-500 to-maroon-700 text-cream flex items-center justify-center font-display font-extrabold shadow-md border-2 border-gold-500 relative select-none",
          sizeMap[size]
        )}
      >
        <span className="leading-none pt-0.5">ප</span>
        <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-gold-500 rounded-full border-2 border-white flex items-center justify-center text-[7px] text-maroon-900 font-black">
          ★
        </div>
      </div>

      {showText && (
        <div className="flex flex-col text-left">
          <span className="font-display font-bold text-xl tracking-tight text-maroon-900 leading-tight">
            පදනම ප්‍රකාශන
          </span>
          <span className="text-[10px] text-ink-muted uppercase tracking-widest font-semibold">
            Padanama Publications
          </span>
        </div>
      )}
    </div>
  );
}
