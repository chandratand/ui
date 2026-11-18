"use client";

import * as React from "react";
import { ScrollArea as ScrollAreaPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

/**
 * A fixed-size region with thin, consistent scrollbars on every platform. Name it with
 * `aria-label` or `aria-labelledby`: the viewport becomes a focusable `region`, so keyboard
 * users can scroll it even when it holds no links or controls. Add a horizontal `ScrollBar`
 * for wide content. For a whole page, let the browser scroll.
 */
function ScrollArea({
  className,
  children,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.Root>) {
  const named = ariaLabel != null || ariaLabelledBy != null;
  return (
    <ScrollAreaPrimitive.Root
      data-slot="scroll-area"
      className={cn(
        "relative rounded-md",
        // The ring sits on the root: the root clips overflow, which would hide a ring on the viewport.
        "has-[[data-slot=scroll-area-viewport]:focus-visible]:ring-2 has-[[data-slot=scroll-area-viewport]:focus-visible]:ring-ring has-[[data-slot=scroll-area-viewport]:focus-visible]:ring-offset-2 has-[[data-slot=scroll-area-viewport]:focus-visible]:ring-offset-background",
        className,
      )}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        data-slot="scroll-area-viewport"
        tabIndex={0}
        role={named ? "region" : undefined}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        className="size-full rounded-[inherit] outline-none"
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  );
}

function ScrollBar({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>) {
  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      data-slot="scroll-area-scrollbar"
      orientation={orientation}
      className={cn(
        "flex touch-none select-none p-px transition-colors duration-(--duration-fast) ease-standard",
        orientation === "vertical" && "h-full w-2.5 border-l border-l-transparent",
        orientation === "horizontal" && "h-2.5 flex-col border-t border-t-transparent",
        className,
      )}
      {...props}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb
        data-slot="scroll-area-thumb"
        className="relative flex-1 rounded-sm bg-input"
      />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  );
}

export { ScrollArea, ScrollBar };
