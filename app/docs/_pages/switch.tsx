import { Label } from "@/registry/chandratand/ui/label";
import { Switch } from "@/registry/chandratand/ui/switch";
import { DocsSection } from "./section";

const code = "font-mono text-sm";

export function SwitchDocs() {
  return (
    <>
      <DocsSection title="Usage">
        <p className="text-muted-foreground">
          A setting that applies as soon as it is flipped, with no Save button. Inside a form that
          is submitted, use Checkbox instead.
        </p>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Switch id="switch-backup" defaultChecked />
            <Label htmlFor="switch-backup">Auto-backup</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch id="switch-email" />
            <Label htmlFor="switch-email">Email me when an invoice is paid</Label>
          </div>
        </div>
      </DocsSection>

      <DocsSection title="Sizes">
        <p className="text-muted-foreground">
          <code className={code}>sm</code>, <code className={code}>md</code> (default) and{" "}
          <code className={code}>lg</code> for touch.
        </p>
        <div className="flex flex-col gap-3">
          {(["sm", "md", "lg"] as const).map((size) => (
            <div key={size} className="flex items-center gap-2">
              <Switch id={`switch-size-${size}`} size={size} defaultChecked />
              <Label htmlFor={`switch-size-${size}`}>Compact rows ({size})</Label>
            </div>
          ))}
        </div>
      </DocsSection>

      <DocsSection title="States">
        <p className="text-muted-foreground">
          Off and on differ in thumb position and fill, not colour alone. Disabled switches are
          skipped by the keyboard.
        </p>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Switch id="switch-disabled" disabled />
            <Label htmlFor="switch-disabled">Disabled</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch id="switch-disabled-on" disabled defaultChecked />
            <Label htmlFor="switch-disabled-on">Disabled and on</Label>
          </div>
        </div>
      </DocsSection>
    </>
  );
}
