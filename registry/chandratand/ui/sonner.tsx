"use client";

import * as React from "react";
import { CircleAlert, CircleCheck, Info, LoaderCircle, TriangleAlert } from "lucide-react";
import { Toaster as Sonner, toast, type ToasterProps } from "sonner";

/**
 * Toasts (sonner). Mount <Toaster /> once near the root, then call `toast("Saved")`,
 * `toast.success(…)`, `toast.error(…)` anywhere. Status = icon + colour, never colour alone.
 * Styled entirely with chandratand/ui tokens, so it follows `.dark` and `data-brand` with no theme prop.
 */
function Toaster({ toastOptions, ...props }: ToasterProps) {
  return (
    <Sonner
      className="toaster group"
      icons={{
        success: <CircleCheck aria-hidden className="size-icon-sm stroke-[1.5]" />,
        info: <Info aria-hidden className="size-icon-sm stroke-[1.5]" />,
        warning: <TriangleAlert aria-hidden className="size-icon-sm stroke-[1.5]" />,
        error: <CircleAlert aria-hidden className="size-icon-sm stroke-[1.5]" />,
        loading: <LoaderCircle aria-hidden className="size-icon-sm animate-spin stroke-[1.5]" />,
      }}
      toastOptions={{
        unstyled: true,
        ...toastOptions,
        classNames: {
          toast:
            "flex w-(--width) items-start gap-3 rounded-lg border border-border bg-popover p-4 text-sm text-popover-foreground shadow-sm",
          icon: "mt-0.5 flex shrink-0 items-center",
          content: "flex flex-1 flex-col gap-1",
          title: "font-medium",
          description: "text-muted-foreground",
          actionButton:
            "inline-flex h-control-sm shrink-0 items-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary-hover",
          cancelButton:
            "inline-flex h-control-sm shrink-0 items-center rounded-md border border-input bg-card px-3 text-sm font-medium hover:bg-accent",
          closeButton:
            "absolute top-2 right-2 rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-accent-foreground",
          success: "[&_[data-icon]]:text-success",
          info: "[&_[data-icon]]:text-info",
          warning: "[&_[data-icon]]:text-warning",
          error: "[&_[data-icon]]:text-destructive",
          ...toastOptions?.classNames,
        },
      }}
      {...props}
    />
  );
}

export { Toaster, toast };
