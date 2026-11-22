import { Skeleton } from "@/registry/chandratand/ui/skeleton";
import { DocsSection } from "./section";

const code = "font-mono text-sm";

export function SkeletonDocs() {
  return (
    <>
      <DocsSection title="Usage">
        <p className="text-muted-foreground">
          A placeholder shaped like the content it stands in for, so the layout does not jump
          when the content arrives. Size it with <code className={code}>className</code>.
          Skeletons are hidden from screen readers: mark the loading region with{" "}
          <code className={code}>aria-busy</code> and give it a text alternative.
        </p>
        <div className="flex max-w-sm items-center gap-3" aria-busy="true">
          <span className="sr-only">Loading client</span>
          <Skeleton className="size-control-md rounded-full" />
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      </DocsSection>

      <DocsSection title="Motion">
        <p className="text-muted-foreground">
          The pulse stops under reduced motion; the placeholder stays.
        </p>
        <div className="flex max-w-md flex-col gap-2" aria-busy="true">
          <span className="sr-only">Loading invoices</span>
          {[0, 1, 2].map((row) => (
            <Skeleton key={row} className="h-row-comfortable w-full" />
          ))}
        </div>
      </DocsSection>
    </>
  );
}
