import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "gold" | "sage" | "danger";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#FAF7F2] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none active:scale-[0.98]";

    const variants = {
      primary:
        "bg-[#4C6957] hover:bg-[#3C5445] text-white font-semibold shadow-sm hover:shadow-md hover:shadow-[#4C6957]/20 focus:ring-[#4C6957]",
      sage:
        "bg-[#4C6957] hover:bg-[#3C5445] text-white font-semibold shadow-sm hover:shadow-md hover:shadow-[#4C6957]/20 focus:ring-[#4C6957]",
      gold:
        "bg-linear-to-r from-[#C5A059] via-[#BE964E] to-[#B38E44] hover:brightness-105 text-white font-semibold shadow-sm hover:shadow-md hover:shadow-[#C5A059]/25 focus:ring-[#C5A059]",
      secondary:
        "bg-[#F3ECE4] hover:bg-[#EAE2D8] text-[#2A211B] font-medium border border-[#E4DBD0] focus:ring-[#4C6957]",
      outline:
        "border border-[#D9CDBF] hover:border-[#4C6957] text-[#2A211B] hover:text-[#4C6957] bg-white/80 hover:bg-[#F4F8F5] focus:ring-[#4C6957]",
      ghost:
        "text-[#5A4D45] hover:text-[#2A211B] hover:bg-[#EEF3EF] focus:ring-[#4C6957]",
      danger:
        "bg-[#8C3A27] hover:bg-[#782823] text-white font-medium shadow-sm focus:ring-[#8C3A27]",
    };

    const sizes = {
      sm: "text-xs px-3.5 py-1.5 gap-1.5",
      md: "text-sm px-4.5 py-2 gap-2",
      lg: "text-base px-6 py-2.5 gap-2.5",
      icon: "p-2 aspect-square",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin text-current" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
