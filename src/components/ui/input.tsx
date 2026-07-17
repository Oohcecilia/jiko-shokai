"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="group relative">
        <input
          id={inputId}
          ref={ref}
          placeholder=" "
          className={cn(
            "peer h-14 w-full rounded-xl border border-glass-border bg-white/[0.03] px-4 pt-4 text-sm text-white outline-none backdrop-blur-xl transition-colors duration-300 placeholder-shown:pt-0 focus:border-electric/60 focus:bg-white/[0.05]",
            error && "border-red-500/60",
            className
          )}
          {...props}
        />
        <label
          htmlFor={inputId}
          className="pointer-events-none absolute left-4 top-2 text-[11px] text-white/50 transition-all duration-300 ease-premium peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:text-white/35 peer-focus:top-2 peer-focus:-translate-y-0 peer-focus:text-[11px] peer-focus:text-electric"
        >
          {label}
        </label>
        <span className="pointer-events-none absolute inset-x-0 -bottom-px h-px scale-x-0 bg-gradient-to-r from-electric via-cyan to-violet transition-transform duration-300 ease-premium peer-focus:scale-x-100" />
        {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
