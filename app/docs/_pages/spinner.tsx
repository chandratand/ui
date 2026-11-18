import { Button } from "@/registry/chandratand/ui/button";
import { Spinner } from "@/registry/chandratand/ui/spinner";
import { DocsSection } from "./section";

export function SpinnerDocs() {
  return (
    <>
      <DocsSection title="Usage">
        <p className="text-muted-foreground">
          For a wait of unknown length. It is a status named &ldquo;Loading&rdquo;; pass{" "}
          <code className="font-mono text-sm">aria-label</code> to say what is loading. It takes
          the current text colour and stops spinning under reduced motion.
        </p>
        <div className="flex flex-wrap items-center gap-6">
          <Spinner />
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Spinner size="sm" aria-label="Loading clients" />
            <span aria-hidden>Loading clients…</span>
          </div>
          <Spinner className="text-primary" />
        </div>
      </DocsSection>

      <DocsSection title="Sizes">
        <p className="text-muted-foreground">
          <code className="font-mono text-sm">sm</code> 16px inline with text,{" "}
          <code className="font-mono text-sm">md</code> 20px (default),{" "}
          <code className="font-mono text-sm">lg</code> 32px for a whole region.
        </p>
        <div className="flex flex-wrap items-center gap-6">
          <Spinner size="sm" />
          <Spinner size="md" />
          <Spinner size="lg" />
        </div>
      </DocsSection>

      <DocsSection title="In a button">
        <p className="text-muted-foreground">
          Disable the button while it works and change its label to say so. The button already
          names the state, so pass <code className="font-mono text-sm">aria-hidden</code> to the
          Spinner. It sizes itself to the button.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Button disabled>
            <Spinner aria-hidden />
            Saving
          </Button>
          <Button variant="outline" size="sm" disabled>
            <Spinner aria-hidden />
            Loading more
          </Button>
        </div>
      </DocsSection>
    </>
  );
}
