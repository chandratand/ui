import { Plus, SearchX, Users } from "lucide-react";

import { Button } from "@/registry/chandratand/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/registry/chandratand/ui/empty";
import { DocsSection } from "./section";

export function EmptyDocs() {
  return (
    <>
      <DocsSection title="Usage">
        <p className="text-muted-foreground">
          A title that says what is missing, a description that says why or what to do, and an
          optional action. The message is text, never colour alone. Add{" "}
          <code className="font-mono text-sm">border</code> for the dashed outline.
        </p>
        <Empty className="border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Users aria-hidden />
            </EmptyMedia>
            <EmptyTitle>No clients yet</EmptyTitle>
            <EmptyDescription>Add your first client to send them invoices.</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button>
              <Plus aria-hidden /> Add client
            </Button>
          </EmptyContent>
        </Empty>
      </DocsSection>

      <DocsSection title="Media">
        <p className="text-muted-foreground">
          <code className="font-mono text-sm">EmptyMedia</code> takes{" "}
          <code className="font-mono text-sm">variant=&quot;icon&quot;</code> for an icon on a
          muted tile, or <code className="font-mono text-sm">plain</code> (default) for an image
          or avatar. Icons are decorative: the title carries the meaning.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Empty className="border">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Users aria-hidden />
              </EmptyMedia>
              <EmptyTitle>Icon tile</EmptyTitle>
              <EmptyDescription>variant=&quot;icon&quot;</EmptyDescription>
            </EmptyHeader>
          </Empty>
          <Empty className="border">
            <EmptyHeader>
              <EmptyMedia>
                <Users aria-hidden className="size-8 text-muted-foreground" />
              </EmptyMedia>
              <EmptyTitle>Plain</EmptyTitle>
              <EmptyDescription>variant=&quot;plain&quot;</EmptyDescription>
            </EmptyHeader>
          </Empty>
        </div>
      </DocsSection>

      <DocsSection title="Without an action">
        <p className="text-muted-foreground">
          When there is nothing to do but change the query, leave out{" "}
          <code className="font-mono text-sm">EmptyContent</code>. Inside a table or card, drop
          the border.
        </p>
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <SearchX aria-hidden />
            </EmptyMedia>
            <EmptyTitle>No results</EmptyTitle>
            <EmptyDescription>
              Nothing matches &ldquo;acme&rdquo;. Try a different search or{" "}
              <a href="#usage">clear the filters</a>.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </DocsSection>
    </>
  );
}
