import * as React from "react";
import { cn } from "@/lib/utils";

export interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export function Logo({ className, size = "md" }: LogoProps) {
  const heightMap = {
    sm: "h-9 sm:h-10",
    md: "h-11 sm:h-12",
    lg: "h-14 sm:h-16",
  };

  return (
    <div className={cn("inline-flex items-center gap-2 select-none", className)}>
      <picture>
        <source srcSet="/images/logo.webp" type="image/webp" />
        <source srcSet="/images/logo.png" type="image/png" />
        <img
          src="/images/logo.webp"
          alt="පදනම ප්‍රකාශන - Padanama Publication"
          className={cn("w-auto max-w-[240px] sm:max-w-[280px] object-contain drop-shadow-sm transition-transform duration-200 hover:scale-[1.02]", heightMap[size])}
        />
      </picture>
    </div>
  );
}
