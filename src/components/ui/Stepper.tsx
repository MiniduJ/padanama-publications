import * as React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export interface StepItem {
  id: number;
  label: string;
}

export interface StepperProps {
  steps: StepItem[];
  currentStep: number;
  className?: string;
}

export function Stepper({ steps, currentStep, className }: StepperProps) {
  return (
    <div className={cn("w-full py-4", className)}>
      <div className="flex items-center justify-between max-w-lg mx-auto relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-gray-200 w-full -z-0" />
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-saffron-500 transition-all duration-300 -z-0"
          style={{
            width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
          }}
        />

        {steps.map((step) => {
          const isCompleted = step.id < currentStep;
          const isCurrent = step.id === currentStep;

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center">
              <div
                className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-colors shadow-sm",
                  isCompleted
                    ? "bg-green-700 text-white"
                    : isCurrent
                    ? "bg-saffron-500 text-white ring-4 ring-saffron-100"
                    : "bg-white border-2 border-gray-300 text-gray-500"
                )}
              >
                {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : step.id}
              </div>
              <span
                className={cn(
                  "text-[11px] font-semibold mt-2 absolute -bottom-5 whitespace-nowrap",
                  isCurrent ? "text-maroon-900" : "text-gray-500"
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
