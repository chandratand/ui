"use client";

import * as React from "react";
import { Tabs as TabsPrimitive } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Switch between views of the same context. `segmented` (default) = pill group on muted;
 * `line` = underline, for page-level sections.
 */
function Tabs({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("group/tabs flex gap-3 data-[orientation=vertical]:flex-row flex-col", className)}
      {...props}
    />
  );
}

const tabsListVariants = cva(
  "group/tabs-list inline-flex w-fit items-center text-muted-foreground group-data-[orientation=vertical]/tabs:flex-col group-data-[orientation=vertical]/tabs:items-stretch",
  {
    variants: {
      variant: {
        segmented: "gap-1 rounded-md bg-muted p-1",
        line: "gap-4 border-b border-border group-data-[orientation=vertical]/tabs:gap-1 group-data-[orientation=vertical]/tabs:border-b-0 group-data-[orientation=vertical]/tabs:border-r",
      },
    },
    defaultVariants: { variant: "segmented" },
  },
);

function TabsList({
  className,
  variant,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List> & VariantProps<typeof tabsListVariants>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant ?? "segmented"}
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    />
  );
}

function TabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "relative inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium",
        "transition-colors duration-(--duration-fast) ease-standard hover:text-foreground",
        "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "disabled:pointer-events-none disabled:opacity-50",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:size-icon-sm [&_svg]:stroke-[1.5]",
        // segmented
        "group-data-[variant=segmented]/tabs-list:h-[calc(var(--control-md)-0.5rem)] group-data-[variant=segmented]/tabs-list:rounded-sm group-data-[variant=segmented]/tabs-list:px-3",
        "group-data-[variant=segmented]/tabs-list:data-[state=active]:bg-card group-data-[variant=segmented]/tabs-list:data-[state=active]:text-foreground group-data-[variant=segmented]/tabs-list:data-[state=active]:shadow-sm",
        // line: 2px indicator sits on the list border
        "group-data-[variant=line]/tabs-list:h-control-md group-data-[variant=line]/tabs-list:px-1 group-data-[variant=line]/tabs-list:rounded-sm",
        "group-data-[variant=line]/tabs-list:data-[state=active]:text-foreground",
        "after:absolute after:bg-primary after:opacity-0 group-data-[variant=line]/tabs-list:data-[state=active]:after:opacity-100",
        "group-data-[orientation=horizontal]/tabs:after:inset-x-0 group-data-[orientation=horizontal]/tabs:after:-bottom-px group-data-[orientation=horizontal]/tabs:after:h-0.5",
        "group-data-[orientation=vertical]/tabs:justify-start group-data-[orientation=vertical]/tabs:after:inset-y-0 group-data-[orientation=vertical]/tabs:after:-right-px group-data-[orientation=vertical]/tabs:after:w-0.5",
        className,
      )}
      {...props}
    />
  );
}

function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn(
        "flex-1 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
      {...props}
    />
  );
}

export { Tabs, TabsContent, TabsList, TabsTrigger, tabsListVariants };
