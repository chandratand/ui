import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Multi-line text entry. Same rules as Input: visible Label, `aria-invalid` +
 * `aria-describedby` for errors. Resizes vertically only.
 */
function Textarea({ className, rows = 3, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      rows={rows}
      className={cn(
        "flex w-full min-w-0 resize-y rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground",
        "placeholder:text-muted-foreground",
        "transition-colors duration-(--duration-fast) ease-standard",
        "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "aria-invalid:border-destructive",
        "disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
