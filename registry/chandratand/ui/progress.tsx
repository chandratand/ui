"use client";

import * as React from "react";
import { Progress as ProgressPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

/**
 * Determinate progress of a task with a known end (upload, multi-step setup). Give it a name
 * with `aria-label` or `aria-labelledby`. For unknown duration use Spinner or Skeleton.
 */
function Progress({
  className,
  value,
  max = 100,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  const percent = value == null ? 0 : (Math.min(Math.max(value, 0), max) / max) * 100;
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      value={value}
      max={max}
      className={cn("relative h-2 w-full overflow-hidden rounded-sm bg-muted", className)}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="size-full bg-primary transition-transform duration-(--duration-normal) ease-standard"
        style={{ transform: `translateX(-${100 - percent}%)` }}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };
