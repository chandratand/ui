import { CircleAlert, CircleCheck, Info, TriangleAlert } from "lucide-react";

import { Badge } from "@/registry/chandratand/ui/badge";
import { DocsSection } from "./section";

const code = "font-mono text-sm";

export function BadgeDocs() {
  return (
    <>
      <DocsSection title="Variants">
        <p className="text-muted-foreground">
          <code className={code}>neutral</code> (default), <code className={code}>primary</code>{" "}
          and <code className={code}>outline</code> for counts, tags and categories.
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <Badge>Neutral</Badge>
          <Badge variant="primary">Primary</Badge>
          <Badge variant="outline">Outline</Badge>
        </div>
      </DocsSection>

      <DocsSection title="Status">
        <p className="text-muted-foreground">
          <code className={code}>success</code>, <code className={code}>warning</code>,{" "}
          <code className={code}>destructive</code> and <code className={code}>info</code>. The
          text names the status; add an icon so it never rests on colour alone.
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="success">
            <CircleCheck aria-hidden /> Paid
          </Badge>
          <Badge variant="warning">
            <TriangleAlert aria-hidden /> Due soon
          </Badge>
          <Badge variant="destructive">
            <CircleAlert aria-hidden /> Overdue
          </Badge>
          <Badge variant="info">
            <Info aria-hidden /> Draft
          </Badge>
        </div>
      </DocsSection>

      <DocsSection title="As a link">
        <p className="text-muted-foreground">
          Pass <code className={code}>asChild</code> to render a link, for example a tag that
          filters a list.
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <Badge asChild variant="outline">
            <a href="#status">Retail</a>
          </Badge>
        </div>
      </DocsSection>
    </>
  );
}
