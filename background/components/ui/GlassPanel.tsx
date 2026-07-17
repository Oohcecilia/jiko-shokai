import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlassPanelProps {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  /** Adds the animated-gradient hairline border. */
  bordered?: boolean;
}

/**
 * Shared "premium glass" surface: translucent background, blur, soft border,
 * and an optional gradient hairline (via the `.gradient-border` utility
 * defined in globals.css). Used for elevated content blocks like the
 * footer's contact panel — compose it anywhere you want the same look.
 */
export function GlassPanel({
  as: Tag = "div",
  children,
  className,
  bordered = true,
}: GlassPanelProps) {
  return (
    <Tag
      className={cn(
        "glass-card relative rounded-card",
        bordered && "gradient-border",
        className
      )}
    >
      {children}
    </Tag>
  );
}
