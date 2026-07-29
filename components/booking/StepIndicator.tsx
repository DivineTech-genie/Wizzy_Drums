"use client";

import { Check, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  labels: string[];
}

export function StepIndicator({
  currentStep,
  totalSteps,
  labels,
}: StepIndicatorProps) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="relative flex items-center justify-between">
        {/* Progress Line */}
        <div className="absolute left-0 right-0 top-1/2 h-0.5 -translate-y-1/2 bg-muted">
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{
              width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%`,
            }}
          />
        </div>

        {/* Steps */}
        {labels.map((label, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;
          const isUpcoming = stepNumber > currentStep;

          return (
            <div
              key={stepNumber}
              className="relative flex flex-col items-center gap-2"
            >
              {/* Step Circle */}
              <div
                className={cn(
                  "relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300",
                  isActive &&
                    "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/30 scale-110",
                  isCompleted &&
                    "border-primary bg-primary text-primary-foreground",
                  isUpcoming &&
                    "border-muted bg-background text-muted-foreground",
                )}
              >
                {isCompleted ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <span className="text-sm font-semibold">{stepNumber}</span>
                )}
              </div>

              {/* Label */}
              <span
                className={cn(
                  "text-xs font-medium transition-colors duration-300 whitespace-nowrap",
                  isActive && "text-foreground",
                  isCompleted && "text-primary",
                  isUpcoming && "text-muted-foreground",
                )}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
