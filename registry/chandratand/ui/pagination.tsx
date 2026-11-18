import * as React from "react";
import { Slot } from "radix-ui";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/registry/chandratand/ui/button";

type PaginationSize = "sm" | "md" | "lg";

const minWidth: Record<PaginationSize, string> = {
  sm: "min-w-control-sm",
  md: "min-w-control-md",
  lg: "min-w-control-lg",
};

/**
 * Page navigation for long lists that load a page at a time. Use it when the URL (or state)
 * holds a page number; for "load more" or infinite lists, use a Button instead.
 */
function Pagination({ className, "aria-label": ariaLabel = "Pagination", ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      data-slot="pagination"
      aria-label={ariaLabel}
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  );
}

function PaginationContent({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn("flex flex-row items-center gap-1", className)}
      {...props}
    />
  );
}

function PaginationItem(props: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />;
}

interface PaginationLinkProps extends React.ComponentProps<"a"> {
  /** Marks this link as the current page (`aria-current="page"`). */
  isActive?: boolean;
  size?: PaginationSize;
  /** Render the child element instead of an <a> (e.g. a framework <Link>). */
  asChild?: boolean;
}

/** A page number. Pass `aria-disabled` to keep a link visible but inert (e.g. on the first page). */
function PaginationLink({
  className,
  isActive,
  size = "md",
  asChild = false,
  ...props
}: PaginationLinkProps) {
  const Comp = asChild ? Slot.Root : "a";
  return (
    <Comp
      data-slot="pagination-link"
      aria-current={isActive ? "page" : undefined}
      className={cn(
        buttonVariants({ variant: isActive ? "outline" : "ghost", size }),
        minWidth[size],
        "px-2 aria-disabled:pointer-events-none aria-disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

/**
 * Previous/next share one shape: an icon, a visible word and a fuller accessible name.
 * With `asChild`, the consumer's link becomes the root and the icon and word go inside it.
 */
function PaginationStep({
  direction,
  children,
  className,
  ...props
}: PaginationLinkProps & { direction: "previous" | "next" }) {
  const Icon = direction === "previous" ? ChevronLeft : ChevronRight;
  const word = <span>{direction === "previous" ? "Previous" : "Next"}</span>;
  return (
    <PaginationLink
      aria-label={`Go to ${direction} page`}
      className={cn(direction === "previous" ? "pl-2.5" : "pr-2.5", className)}
      {...props}
    >
      {direction === "next" && word}
      <Slot.Slottable>{children}</Slot.Slottable>
      <Icon aria-hidden />
      {direction === "previous" && word}
    </PaginationLink>
  );
}

function PaginationPrevious(props: PaginationLinkProps) {
  return <PaginationStep direction="previous" data-slot="pagination-previous" {...props} />;
}

function PaginationNext(props: PaginationLinkProps) {
  return <PaginationStep direction="next" data-slot="pagination-next" {...props} />;
}

function PaginationEllipsis({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="pagination-ellipsis"
      className={cn(
        "flex size-control-md items-center justify-center text-muted-foreground [&_svg]:size-icon-sm [&_svg]:stroke-[1.5]",
        className,
      )}
      {...props}
    >
      <MoreHorizontal aria-hidden />
      <span className="sr-only">More pages</span>
    </span>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};
