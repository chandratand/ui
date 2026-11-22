import { Label } from "@/registry/chandratand/ui/label";
import { RadioGroup, RadioGroupItem } from "@/registry/chandratand/ui/radio-group";
import { DocsSection } from "./section";

const code = "font-mono text-sm";

export function RadioGroupDocs() {
  return (
    <>
      <DocsSection title="Usage">
        <p className="text-muted-foreground">
          Pick exactly one of two to five options that should all stay visible. More than that,
          use Select. Name the group with <code className={code}>aria-labelledby</code>; arrow
          keys move between options.
        </p>
        <div className="flex flex-col gap-3">
          <p id="radio-payment-label" className="text-sm font-medium">
            Payment method
          </p>
          <RadioGroup defaultValue="transfer" aria-labelledby="radio-payment-label">
            {[
              { value: "transfer", label: "Bank transfer" },
              { value: "card", label: "Card" },
              { value: "cash", label: "Cash" },
            ].map(({ value, label }) => (
              <div key={value} className="flex items-center gap-2">
                <RadioGroupItem id={`radio-payment-${value}`} value={value} />
                <Label htmlFor={`radio-payment-${value}`}>{label}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </DocsSection>

      <DocsSection title="Sizes">
        <p className="text-muted-foreground">
          Same sizes and hit areas as Checkbox: <code className={code}>md</code> (default) and{" "}
          <code className={code}>lg</code> for touch.
        </p>
        <RadioGroup defaultValue="md" aria-label="Radio size">
          <div className="flex items-center gap-2">
            <RadioGroupItem id="radio-size-md" value="md" />
            <Label htmlFor="radio-size-md">Medium</Label>
          </div>
          <div className="flex items-center gap-3">
            <RadioGroupItem id="radio-size-lg" value="lg" size="lg" />
            <Label htmlFor="radio-size-lg">Large (touch)</Label>
          </div>
        </RadioGroup>
      </DocsSection>

      <DocsSection title="States">
        <p className="text-muted-foreground">
          Disable a single option when it does not apply, and say why next to it.
        </p>
        <RadioGroup defaultValue="monthly" aria-label="Billing period">
          <div className="flex items-center gap-2">
            <RadioGroupItem id="radio-period-monthly" value="monthly" />
            <Label htmlFor="radio-period-monthly">Monthly</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem id="radio-period-yearly" value="yearly" disabled />
            <Label htmlFor="radio-period-yearly">Yearly (not on this plan)</Label>
          </div>
        </RadioGroup>
      </DocsSection>
    </>
  );
}
