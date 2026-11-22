import { Label } from "@/registry/chandratand/ui/label";
import { Textarea } from "@/registry/chandratand/ui/textarea";
import { DocsSection } from "./section";

const code = "font-mono text-sm";

export function TextareaDocs() {
  return (
    <>
      <DocsSection title="Usage">
        <p className="text-muted-foreground">
          For text longer than one line, such as notes or addresses. It resizes vertically only,
          so it never breaks the layout sideways.
        </p>
        <div className="flex max-w-md flex-col gap-2">
          <Label htmlFor="textarea-usage">Notes (optional)</Label>
          <Textarea id="textarea-usage" placeholder="Anything the client should know" />
        </div>
      </DocsSection>

      <DocsSection title="States">
        <p className="text-muted-foreground">
          Same rules as Input: <code className={code}>aria-invalid</code> with a linked message
          for errors, <code className={code}>disabled</code> to take it out of the form.
        </p>
        <div className="flex max-w-md flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="textarea-invalid">Delivery address</Label>
            <Textarea id="textarea-invalid" aria-invalid aria-describedby="textarea-invalid-error" />
            <p id="textarea-invalid-error" className="text-sm text-destructive">
              Enter the delivery address.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="textarea-disabled">Internal notes</Label>
            <Textarea id="textarea-disabled" disabled defaultValue="Locked after the invoice is sent." />
          </div>
        </div>
      </DocsSection>
    </>
  );
}
