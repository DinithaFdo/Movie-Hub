import * as React from "react";

import { cn } from "@/lib/utils";

type ButtonVariant = "default" | "outline" | "ghost";
type ButtonSize = "default" | "icon";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantClasses: Record<ButtonVariant, string> = {
  default:
    "bg-[#ffa31a] text-black font-semibold border border-[#ffa31a] shadow-[0_0_0_rgba(255,163,26,0)] hover:bg-[#ffb347] hover:shadow-[0_0_18px_rgba(255,163,26,0.3)]",
  outline:
    "bg-transparent text-white border border-[#ffa31a] hover:bg-[#ffa31a]/15 hover:text-white hover:shadow-[0_0_16px_rgba(255,163,26,0.22)]",
  ghost:
    "bg-transparent text-white hover:bg-white/10 border border-transparent",
};

const sizeClasses: Record<ButtonSize, string> = {
  default: "h-10 px-4 py-2",
  icon: "h-10 w-10 p-0",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-xl text-sm transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffa31a] disabled:pointer-events-none disabled:opacity-50 active:scale-95",
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";
