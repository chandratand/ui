"use client";

import * as React from "react";
import { Slash } from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/registry/chandratand/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/registry/chandratand/ui/dropdown-menu";
import { DocsSection } from "./section";

const trail = ["Home", "Clients", "Client"] as const;

/** Stands in for a router's <Link>: navigates in state instead of loading the URL. */
function RouterLink({
  to,
  onNavigate,
  ...props
}: React.ComponentProps<"a"> & { to: number; onNavigate: (level: number) => void }) {
  return (
    <a
      {...props}
      href={`#level-${to}`}
      onClick={(event) => {
        props.onClick?.(event);
        event.preventDefault();
        onNavigate(to);
      }}
    />
  );
}

function RouterBreadcrumb() {
  const [depth, setDepth] = React.useState(trail.length - 1);
  const levels = trail.slice(0, depth + 1);

  return (
    <div className="flex flex-col gap-3">
      <Breadcrumb>
        <BreadcrumbList>
          {levels.map((label, level) => (
            <React.Fragment key={label}>
              {level > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                {level === depth ? (
                  <BreadcrumbPage>{label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <RouterLink to={level} onNavigate={setDepth}>
                      {label}
                    </RouterLink>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
      <p className="text-sm text-muted-foreground" aria-live="polite">
        Showing {trail[depth]}
      </p>
    </div>
  );
}

export function BreadcrumbDocs() {
  return (
    <>
      <DocsSection title="Usage">
        <p className="text-muted-foreground">
          A <code className="font-mono text-sm">nav</code> landmark labelled
          &ldquo;Breadcrumb&rdquo; around an ordered list. Every level above is a link;{" "}
          <code className="font-mono text-sm">BreadcrumbPage</code> is the page you are on, plain
          text with <code className="font-mono text-sm">aria-current=&quot;page&quot;</code>.
          Separators are hidden from screen readers. Text is{" "}
          <code className="font-mono text-sm">text-sm</code>; there are no sizes, since nothing in
          it is a control.
        </p>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#home">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#invoices">Invoices</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>INV-2026-0142</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </DocsSection>

      <DocsSection title="With a router link">
        <p className="text-muted-foreground">
          Pass <code className="font-mono text-sm">asChild</code> to{" "}
          <code className="font-mono text-sm">BreadcrumbLink</code> and your router&apos;s{" "}
          <code className="font-mono text-sm">&lt;Link&gt;</code> as the child. Following a level
          makes it the current page.
        </p>
        <RouterBreadcrumb />
      </DocsSection>

      <DocsSection title="Collapsed">
        <p className="text-muted-foreground">
          For a deep trail, keep the first and last levels and put the middle behind{" "}
          <code className="font-mono text-sm">BreadcrumbEllipsis</code> in a Dropdown Menu. The
          trigger button needs its own <code className="font-mono text-sm">aria-label</code>.
        </p>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#home">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <DropdownMenu>
                <DropdownMenuTrigger
                  aria-label="Show hidden levels"
                  className="rounded-sm outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <BreadcrumbEllipsis />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem>Sales</DropdownMenuItem>
                  <DropdownMenuItem>Clients</DropdownMenuItem>
                  <DropdownMenuItem>PT Sinar Jaya</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Invoices</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </DocsSection>

      <DocsSection title="Custom separator">
        <p className="text-muted-foreground">
          Pass any icon as the child of{" "}
          <code className="font-mono text-sm">BreadcrumbSeparator</code>; the default is a
          chevron.
        </p>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#home">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <Slash />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage>Settings</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </DocsSection>
    </>
  );
}
