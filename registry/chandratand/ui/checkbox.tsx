"use client";

import * as React from "react";
import { Checkbox as CheckboxPrimitive } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import { Check, Minus } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * md: 16px box with a 24px hit area. lg: 24px box with a 44px hit area (touch).
 * The hit area is an invisible ::after so layout stays tight.
 */
const checkboxVariants = cva(
  [
    "peer group relative inline-flex shrink-0 items-center justify-center rounded-sm border border-input bg-card text-primary-foreground",
    "after:absolute after:content-['']",
    "transition-colors duration-(--duration-fast) ease-standard",
    "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "data-[state=checked]:border-primary data-[state=checked]:bg-primary",
    "data-[state=indeterminate]:border-primary data-[state=indeterminate]:bg-primary",
    "aria-invalid:border-destructive",
    "disabled:cursor-not-allowed disabled:opacity-50",
  ],
  {
    variants: {
      size: {
        md: "size-4 after:-inset-1 [&_svg]:size-3.5",
        lg: "size-6 after:-inset-2.5 [&_svg]:size-5",
      },
    },
    defaultVariants: { size: "md" },
  },
);

export interface CheckboxProps
  extends React.ComponentProps<typeof CheckboxPrimitive.Root>,
    VariantProps<typeof checkboxVariants> {}

/** Pass `checked="indeterminate"` for a parent of partly selected rows. */
function Checkbox({ className, size, ...props }: CheckboxProps) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(checkboxVariants({ size }), className)}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center [&_svg]:stroke-2"
      >
        <Check aria-hidden className="group-data-[state=indeterminate]:hidden" />
        <Minus aria-hidden className="hidden group-data-[state=indeterminate]:block" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox, checkboxVariants };
