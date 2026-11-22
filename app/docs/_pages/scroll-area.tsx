import { ScrollArea, ScrollBar } from "@/registry/chandratand/ui/scroll-area";
import { DocsSection } from "./section";

const releaseNotes = [
  "v1.6.0: invoices can be exported to PDF.",
  "v1.5.2: fixed rounding in tax totals.",
  "v1.5.0: clients can have several contacts.",
  "v1.4.0: dark Mode.",
  "v1.3.1: faster client search.",
  "v1.3.0: recurring invoices.",
  "v1.2.0: payment reminders by email.",
  "v1.1.0: Indonesian date formats.",
  "v1.0.0: first release.",
];

const tags = Array.from({ length: 12 }, (_, index) => `v0.${12 - index}.0`);

const linkClass =
  "rounded-sm text-sm text-primary underline-offset-4 hover:underline outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export function ScrollAreaDocs() {
  return (
    <>
      <DocsSection title="Text content">
        <p className="text-muted-foreground">
          Name the area with <code className="font-mono text-sm">aria-label</code>: it becomes a
          focusable region, so the arrow keys, Page Up/Down, Home and End scroll it even though it
          holds only text. Always give it a name: without one the area is still a tab stop, but a
          screen reader announces nothing when it gets focus.
        </p>
        <ScrollArea aria-label="Release notes" className="h-48 max-w-sm border border-border">
          <ul className="flex flex-col gap-3 p-4 text-sm">
            {releaseNotes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </ScrollArea>
      </DocsSection>

      <DocsSection title="Focusable content">
        <p className="text-muted-foreground">
          Links and controls inside scroll into view when they receive focus.
        </p>
        <ScrollArea aria-label="Tags" className="h-48 max-w-48 border border-border">
          <ul className="flex flex-col gap-2 p-4">
            {tags.map((tag) => (
              <li key={tag}>
                <a href={`#${tag}`} className={linkClass}>
                  {tag}
                </a>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </DocsSection>

      <DocsSection title="Horizontal">
        <p className="text-muted-foreground">
          Add <code className="font-mono text-sm">&lt;ScrollBar orientation=&quot;horizontal&quot; /&gt;</code>{" "}
          for content wider than its container.
        </p>
        <ScrollArea aria-label="Monthly revenue" className="max-w-md border border-border">
          <div className="flex w-max gap-3 p-4">
            {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(
              (month) => (
                <div
                  key={month}
                  className="flex h-20 w-24 shrink-0 flex-col justify-between rounded-md border border-border p-2 text-sm"
                >
                  <span className="text-muted-foreground">{month}</span>
                  <span className="font-medium">Rp 12 jt</span>
                </div>
              ),
            )}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </DocsSection>
    </>
  );
}
