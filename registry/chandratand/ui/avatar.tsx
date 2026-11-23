"use client";

import * as React from "react";
import { Avatar as AvatarPrimitive } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * User photo with initials fallback. Sizes match control heights (32/40/48px).
 * Give AvatarImage a meaningful `alt` (the person's name) unless a name is shown next to it.
 */
const avatarVariants = cva(
  "group/avatar relative flex shrink-0 overflow-hidden rounded-full select-none",
  {
    variants: {
      size: {
        sm: "size-control-sm text-xs",
        md: "size-control-md text-sm",
        lg: "size-control-lg text-base",
      },
    },
    defaultVariants: { size: "md" },
  },
);

export interface AvatarProps
  extends React.ComponentProps<typeof AvatarPrimitive.Root>,
    VariantProps<typeof avatarVariants> {}

function Avatar({ className, size, ...props }: AvatarProps) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      data-size={size ?? "md"}
      className={cn(avatarVariants({ size }), className)}
      {...props}
    />
  );
}

function AvatarImage({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full object-cover", className)}
      {...props}
    />
  );
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "flex size-full items-center justify-center rounded-full bg-muted font-medium text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

/** Overlapping stack of avatars. */
function AvatarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group"
      className={cn(
        "flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background",
        className,
      )}
      {...props}
    />
  );
}

export { Avatar, AvatarFallback, AvatarGroup, AvatarImage, avatarVariants };
