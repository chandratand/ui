"use client";

import * as React from "react";
import { RadioGroup as RadioGroupPrimitive } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Pick exactly one of 2–5 visible options. More options → Select.
 * Pair each item with a <Label htmlFor>. Same sizes and hit areas as Checkbox.
 */
function RadioGroup({ className, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn("grid gap-3", className)}
      {...props}
    />
  );
}

const radioItemVariants = cva(
  [
    "peer relative inline-flex aspect-square shrink-0 items-center justify-center rounded-full border border-input bg-card",
    "after:absolute after:content-['']",
    "transition-colors duration-(--duration-fast) ease-standard",
    "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "data-[state=checked]:border-primary",
    "aria-invalid:border-destructive",
    "disabled:cursor-not-allowed disabled:opacity-50",
  ],
  {
    variants: {
      size: {
        md: "size-4 after:-inset-1 [&_[data-slot=radio-group-indicator]]:size-2",
        lg: "size-6 after:-inset-2.5 [&_[data-slot=radio-group-indicator]]:size-3",
      },
    },
    defaultVariants: { size: "md" },
  },
);

export interface RadioGroupItemProps
  extends React.ComponentProps<typeof RadioGroupPrimitive.Item>,
    VariantProps<typeof radioItemVariants> {}

function RadioGroupItem({ className, size, ...props }: RadioGroupItemProps) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(radioItemVariants({ size }), className)}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="rounded-full bg-primary"
      />
    </RadioGroupPrimitive.Item>
  );
}

export { RadioGroup, RadioGroupItem, radioItemVariants };
