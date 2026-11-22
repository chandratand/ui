import { Checkbox } from "@/registry/chandratand/ui/checkbox";
import { Input } from "@/registry/chandratand/ui/input";
import { Label } from "@/registry/chandratand/ui/label";
import { DocsSection } from "./section";

const code = "font-mono text-sm";

export function LabelDocs() {
  return (
    <>
      <DocsSection title="Usage">
        <p className="text-muted-foreground">
          Every form control needs one. Point <code className={code}>htmlFor</code> at the
          control&apos;s <code className={code}>id</code>, so clicking the label focuses the
          control and screen readers announce it. Placeholders are not labels.
        </p>
        <div className="flex max-w-sm flex-col gap-2">
          <Label htmlFor="label-company">Company name</Label>
          <Input id="label-company" />
        </div>
      </DocsSection>

      <DocsSection title="Wording">
        <p className="text-muted-foreground">
          Sentence case, no trailing colon. Mark the optional fields with
          &ldquo;(optional)&rdquo; rather than the required ones with an asterisk.
        </p>
        <div className="flex max-w-sm flex-col gap-2">
          <Label htmlFor="label-reference">Purchase order (optional)</Label>
          <Input id="label-reference" />
        </div>
      </DocsSection>

      <DocsSection title="Beside a control">
        <p className="text-muted-foreground">
          For checkboxes, radios and switches the label sits to the right of the control, and the
          whole label is part of the click target.
        </p>
        <div className="flex items-center gap-2">
          <Checkbox id="label-copy" />
          <Label htmlFor="label-copy">Send a copy to me</Label>
        </div>
      </DocsSection>
    </>
  );
}
