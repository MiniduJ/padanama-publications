import * as React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "saffron" | "gold" | "green" | "outline" | "ghost" | "link";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "md",
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]";

    const variants = {
      default:
        "bg-maroon-500 hover:bg-maroon-700 text-cream focus-visible:ring-maroon-500 shadow-sm hover:shadow",
      saffron:
        "bg-saffron-500 hover:bg-saffron-700 text-brandNavy hover:text-white font-bold focus-visible:ring-saffron-500 shadow-md hover:shadow-lg",
      gold:
        "bg-gold-500 hover:bg-gold-600 text-ink focus-visible:ring-gold-500 shadow-sm",
      green:
        "bg-green-500 hover:bg-green-700 text-white focus-visible:ring-green-500 shadow-sm",
      outline:
        "border-2 border-maroon-500 text-maroon-900 hover:bg-maroon-50 focus-visible:ring-maroon-500 bg-transparent",
      ghost:
        "hover:bg-maroon-50 text-maroon-900 focus-visible:ring-maroon-500 bg-transparent",
      link:
        "text-maroon-700 underline-offset-4 hover:underline p-0 h-auto bg-transparent",
    };

    const sizes = {
      sm: "h-9 px-3 text-xs",
      md: "h-11 px-5 text-sm",
      lg: "h-13 px-7 text-base font-bold",
      icon: "h-11 w-11 p-0",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
