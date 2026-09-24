import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "gold" | "sage" | "success" | "warning" | "danger" | "outline";
}

export function Badge({
  className,
  variant = "default",
  children,
  ...props
}: BadgeProps) {
  const variants = {
    default: "bg-[#F3ECE4] text-[#5A4D45] border-[#E4DBD0]",
    gold: "bg-[#FAF2E4] text-[#8C6A28] border-[#EBD5B2]",
    sage: "bg-[#EEF3EF] text-[#344E3D] border-[#C2D4C6]",
    success: "bg-[#EEF3EF] text-[#344E3D] border-[#C2D4C6]",
    warning: "bg-[#FAF2E4] text-[#8C6A28] border-[#EBD5B2]",
    danger: "bg-[#FAECE9] text-[#8C3A27] border-[#EBCAC5]",
    outline: "bg-white/80 text-[#5A4D45] border-[#DCD3C7]",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
