import { Checkbox } from "@/registry/chandratand/ui/checkbox";
import { Label } from "@/registry/chandratand/ui/label";
import { DocsSection } from "./section";

const code = "font-mono text-sm";

export function CheckboxDocs() {
  return (
    <>
      <DocsSection title="Usage">
        <p className="text-muted-foreground">
          An on/off choice that is submitted with a form. For a setting that applies at once, use
          Switch.
        </p>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Checkbox id="checkbox-copy" defaultChecked />
            <Label htmlFor="checkbox-copy">Send a copy to me</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="checkbox-terms" />
            <Label htmlFor="checkbox-terms">I agree to the payment terms</Label>
          </div>
        </div>
      </DocsSection>

      <DocsSection title="Sizes">
        <p className="text-muted-foreground">
          <code className={code}>md</code> is a 16px box with a 24px hit area (default);{" "}
          <code className={code}>lg</code> is a 24px box with a 44px hit area, for touch.
        </p>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Checkbox id="checkbox-md" />
            <Label htmlFor="checkbox-md">Medium</Label>
          </div>
          <div className="flex items-center gap-3">
            <Checkbox id="checkbox-lg" size="lg" />
            <Label htmlFor="checkbox-lg">Large (touch)</Label>
          </div>
        </div>
      </DocsSection>

      <DocsSection title="States">
        <p className="text-muted-foreground">
          <code className={code}>checked=&quot;indeterminate&quot;</code> marks a parent whose
          rows are only partly selected. Disabled checkboxes are skipped by the keyboard.
        </p>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Checkbox id="checkbox-indeterminate" checked="indeterminate" />
            <Label htmlFor="checkbox-indeterminate">Select all rows (2 of 5 selected)</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="checkbox-disabled" disabled />
            <Label htmlFor="checkbox-disabled">Disabled</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="checkbox-disabled-checked" disabled defaultChecked />
            <Label htmlFor="checkbox-disabled-checked">Disabled and checked</Label>
          </div>
        </div>
      </DocsSection>
    </>
  );
}
