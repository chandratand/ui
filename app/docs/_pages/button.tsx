import { ArrowRight, Plus, Trash2 } from "lucide-react";

import { Button } from "@/registry/chandratand/ui/button";
import { DocsSection } from "./section";

export function ButtonDocs() {
  return (
    <>
      <DocsSection title="Variants">
        <p className="text-muted-foreground">
          One <code className="font-mono text-sm">primary</code> action per view. Use{" "}
          <code className="font-mono text-sm">destructive</code> only for actions that delete or
          cannot be undone.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">
            <Trash2 aria-hidden /> Delete
          </Button>
          <Button variant="link">Link</Button>
        </div>
      </DocsSection>

      <DocsSection title="Sizes">
        <p className="text-muted-foreground">
          <code className="font-mono text-sm">sm</code> 32px for dense screens,{" "}
          <code className="font-mono text-sm">md</code> 40px (default),{" "}
          <code className="font-mono text-sm">lg</code> 48px for touch.{" "}
          <code className="font-mono text-sm">icon</code> is square and needs an{" "}
          <code className="font-mono text-sm">aria-label</code>.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="sm">
            <Plus aria-hidden /> Small
          </Button>
          <Button size="md">
            Medium <ArrowRight aria-hidden />
          </Button>
          <Button size="lg">Large</Button>
          <Button size="icon" variant="outline" aria-label="Add item">
            <Plus aria-hidden />
          </Button>
        </div>
      </DocsSection>

      <DocsSection title="States">
        <p className="text-muted-foreground">
          Hover and press darken the fill; keyboard focus shows a ring. Disabled buttons are
          skipped by the keyboard.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Button>Enabled</Button>
          <Button disabled>Disabled</Button>
          <Button variant="outline" disabled>
            Disabled outline
          </Button>
        </div>
      </DocsSection>

      <DocsSection title="As a link">
        <p className="text-muted-foreground">
          Pass <code className="font-mono text-sm">asChild</code> to render your router&apos;s link
          with button styles.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Button asChild variant="outline">
            <a href="#variants">Back to variants</a>
          </Button>
        </div>
      </DocsSection>
    </>
  );
}
