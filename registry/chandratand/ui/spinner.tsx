import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { LoaderCircle } from "lucide-react";

import { cn } from "@/lib/utils";

const spinnerVariants = cva(
  "shrink-0 animate-spin stroke-[1.5] motion-reduce:animate-none",
  {
    variants: {
      size: {
        sm: "size-icon-sm",
        md: "size-icon-lg",
        lg: "size-8",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

export interface SpinnerProps
  extends React.ComponentProps<"svg">,
    VariantProps<typeof spinnerVariants> {}

/**
 * Indeterminate loading: the wait has no known length. Use Progress when you can say how far
 * along it is, and Skeleton when the shape of the coming content is known.
 *
 * Announced as a status named "Loading"; pass `aria-label` to say what is loading. Inside a
 * control that already says it (a "Saving" button), pass `aria-hidden` so the name is not read twice.
 * Takes the current text colour, and stops spinning under reduced motion.
 */
function Spinner({ className, size, "aria-label": ariaLabel = "Loading", ...props }: SpinnerProps) {
  return (
    <LoaderCircle
      data-slot="spinner"
      role="status"
      aria-label={ariaLabel}
      className={cn(spinnerVariants({ size }), className)}
      {...props}
    />
  );
}

export { Spinner, spinnerVariants };
