"use client";

import * as React from "react";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/registry/chandratand/ui/pagination";
import { DocsSection } from "./section";

const pageCount = 5;

/** Stands in for a router's <Link>: navigates in state instead of loading the URL. */
function RouterLink({
  page,
  onNavigate,
  ...props
}: React.ComponentProps<"a"> & { page: number; onNavigate: (page: number) => void }) {
  return (
    <a
      href={`?page=${page}`}
      onClick={(event) => {
        event.preventDefault();
        if (props["aria-disabled"]) return;
        onNavigate(page);
      }}
      {...props}
    />
  );
}

function RouterPagination() {
  const [current, setCurrent] = React.useState(1);
  const pages = Array.from({ length: pageCount }, (_, index) => index + 1);
  const first = current === 1;
  const last = current === pageCount;

  return (
    <div className="flex flex-col items-center gap-3">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious asChild aria-disabled={first || undefined}>
              <RouterLink page={Math.max(1, current - 1)} onNavigate={setCurrent} />
            </PaginationPrevious>
          </PaginationItem>
          {pages.map((page) => (
            <PaginationItem key={page}>
              <PaginationLink asChild isActive={page === current}>
                <RouterLink page={page} onNavigate={setCurrent}>
                  {page}
                </RouterLink>
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext asChild aria-disabled={last || undefined}>
              <RouterLink page={Math.min(pageCount, current + 1)} onNavigate={setCurrent} />
            </PaginationNext>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      <p className="text-sm text-muted-foreground" aria-live="polite">
        Showing page {current} of {pageCount}
      </p>
    </div>
  );
}

function ExamplePagination({ size }: { size?: "sm" | "md" | "lg" }) {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#previous" size={size} />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#1" size={size}>
            1
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#2" size={size} isActive>
            2
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#3" size={size}>
            3
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#next" size={size} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

export function PaginationDocs() {
  return (
    <>
      <DocsSection title="Usage">
        <p className="text-muted-foreground">
          A <code className="font-mono text-sm">nav</code> landmark labelled
          &ldquo;Pagination&rdquo;. <code className="font-mono text-sm">isActive</code> marks the
          current page with <code className="font-mono text-sm">aria-current=&quot;page&quot;</code>{" "}
          and an outline. Previous and next read as &ldquo;Go to previous page&rdquo; and
          &ldquo;Go to next page&rdquo;. The ellipsis is announced as &ldquo;More pages&rdquo;.
        </p>
        <ExamplePagination />
      </DocsSection>

      <DocsSection title="Sizes">
        <p className="text-muted-foreground">
          Every link takes <code className="font-mono text-sm">size</code>:{" "}
          <code className="font-mono text-sm">sm</code> 32px,{" "}
          <code className="font-mono text-sm">md</code> 36px (default),{" "}
          <code className="font-mono text-sm">lg</code> 44px for touch.
        </p>
        <div className="flex flex-col gap-4">
          <ExamplePagination size="sm" />
          <ExamplePagination size="md" />
          <ExamplePagination size="lg" />
        </div>
      </DocsSection>

      <DocsSection title="With a router link">
        <p className="text-muted-foreground">
          Pass <code className="font-mono text-sm">asChild</code> and your router&apos;s{" "}
          <code className="font-mono text-sm">&lt;Link&gt;</code> as the child; previous and next
          keep their icon and label inside it. On the first and last page, set{" "}
          <code className="font-mono text-sm">aria-disabled</code> so the step stays visible but
          inert.
        </p>
        <RouterPagination />
      </DocsSection>
    </>
  );
}
