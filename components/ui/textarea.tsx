import React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold text-[#2A211B]"
          >
            {label}
          </label>
        )}
        <textarea
          id={inputId}
          ref={ref}
          className={cn(
            "w-full rounded-xl bg-white border border-[#EAE3D8] px-3.5 py-2.5 text-sm text-[#2A211B] placeholder:text-[#8A7C71] transition-all duration-150 focus:outline-none focus:border-[#4C6957] focus:ring-1 focus:ring-[#4C6957]/30 shadow-xs disabled:opacity-50 disabled:cursor-not-allowed resize-y min-h-22.5",
            error && "border-red-500/80 focus:border-red-500 focus:ring-red-500/40",
            className
          )}
          {...props}
        />
        {error ? (
          <p className="text-xs text-red-600 font-medium">{error}</p>
        ) : hint ? (
          <p className="text-xs text-[#8A7C71]">{hint}</p>
        ) : null}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
