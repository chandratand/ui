import { Input } from "@/registry/chandratand/ui/input";
import { Label } from "@/registry/chandratand/ui/label";
import { DocsSection } from "./section";

const code = "font-mono text-sm";

export function InputDocs() {
  return (
    <>
      <DocsSection title="Usage">
        <p className="text-muted-foreground">
          Always pair an Input with a visible <code className={code}>Label</code>. Set{" "}
          <code className={code}>type</code> and <code className={code}>autoComplete</code> so
          browsers and password managers can help.
        </p>
        <div className="flex max-w-sm flex-col gap-2">
          <Label htmlFor="input-usage-email">Work email</Label>
          <Input id="input-usage-email" type="email" autoComplete="email" />
        </div>
      </DocsSection>

      <DocsSection title="Sizes">
        <p className="text-muted-foreground">
          <code className={code}>sm</code> 32px for dense forms,{" "}
          <code className={code}>md</code> 40px (default), <code className={code}>lg</code> 48px
          for touch. Match the size of the buttons next to it.
        </p>
        <div className="flex max-w-sm flex-col gap-4">
          {(["sm", "md", "lg"] as const).map((size) => (
            <div key={size} className="flex flex-col gap-2">
              <Label htmlFor={`input-size-${size}`}>Invoice number ({size})</Label>
              <Input id={`input-size-${size}`} size={size} placeholder="INV-1042" />
            </div>
          ))}
        </div>
      </DocsSection>

      <DocsSection title="States">
        <p className="text-muted-foreground">
          Mark an invalid value with <code className={code}>aria-invalid</code> and link the
          message with <code className={code}>aria-describedby</code>, or let{" "}
          <code className={code}>Field</code> wire both. Disabled inputs are skipped by the
          keyboard; use <code className={code}>readOnly</code> for a value people should still
          be able to select and copy.
        </p>
        <div className="flex max-w-sm flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="input-invalid">Billing email</Label>
            <Input
              id="input-invalid"
              type="email"
              defaultValue="finance@"
              aria-invalid
              aria-describedby="input-invalid-error"
            />
            <p id="input-invalid-error" className="text-sm text-destructive">
              Enter a full email address, like finance@example.com.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="input-readonly">Client ID</Label>
            <Input id="input-readonly" readOnly defaultValue="CL-00381" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="input-disabled">Tax number</Label>
            <Input id="input-disabled" disabled defaultValue="01.234.567.8-901.000" />
          </div>
        </div>
      </DocsSection>
    </>
  );
}
