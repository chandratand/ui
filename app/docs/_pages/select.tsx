import { Label } from "@/registry/chandratand/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/registry/chandratand/ui/select";
import { DocsSection } from "./section";

const code = "font-mono text-sm";

export function SelectDocs() {
  return (
    <>
      <DocsSection title="Usage">
        <p className="text-muted-foreground">
          Pick one value from a short list, up to about 15 options. For a longer list people
          need to search, use Combobox. Label the trigger like an Input.
        </p>
        <div className="flex max-w-sm flex-col gap-2">
          <Label htmlFor="select-terms">Payment terms</Label>
          <Select defaultValue="net30">
            <SelectTrigger id="select-terms">
              <SelectValue placeholder="Choose terms" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="due">Due on receipt</SelectItem>
              <SelectItem value="net14">Net 14</SelectItem>
              <SelectItem value="net30">Net 30</SelectItem>
              <SelectItem value="net60" disabled>
                Net 60
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </DocsSection>

      <DocsSection title="Sizes">
        <p className="text-muted-foreground">
          The trigger takes <code className={code}>size</code> like Input:{" "}
          <code className={code}>sm</code> 32px, <code className={code}>md</code> 40px (default),{" "}
          <code className={code}>lg</code> 48px.
        </p>
        <div className="flex max-w-sm flex-col gap-4">
          {(["sm", "md", "lg"] as const).map((size) => (
            <div key={size} className="flex flex-col gap-2">
              <Label htmlFor={`select-size-${size}`}>Currency ({size})</Label>
              <Select>
                <SelectTrigger id={`select-size-${size}`} size={size}>
                  <SelectValue placeholder="Choose a currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="idr">IDR</SelectItem>
                  <SelectItem value="usd">USD</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
      </DocsSection>

      <DocsSection title="Groups">
        <p className="text-muted-foreground">
          Group related options under a <code className={code}>SelectLabel</code>, with a{" "}
          <code className={code}>SelectSeparator</code> between groups.
        </p>
        <div className="flex max-w-sm flex-col gap-2">
          <Label htmlFor="select-timezone">Time zone</Label>
          <Select defaultValue="wib">
            <SelectTrigger id="select-timezone">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Indonesia</SelectLabel>
                <SelectItem value="wib">WIB (UTC+7)</SelectItem>
                <SelectItem value="wita">WITA (UTC+8)</SelectItem>
                <SelectItem value="wit">WIT (UTC+9)</SelectItem>
              </SelectGroup>
              <SelectSeparator />
              <SelectGroup>
                <SelectLabel>Other</SelectLabel>
                <SelectItem value="sgt">Singapore (UTC+8)</SelectItem>
                <SelectItem value="utc">UTC</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </DocsSection>

      <DocsSection title="States">
        <p className="text-muted-foreground">
          <code className={code}>aria-invalid</code> on the trigger shows the error border; link
          the message with <code className={code}>aria-describedby</code>. A disabled Select is
          skipped by the keyboard.
        </p>
        <div className="flex max-w-sm flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="select-invalid">Tax rate</Label>
            <Select>
              <SelectTrigger
                id="select-invalid"
                aria-invalid
                aria-describedby="select-invalid-error"
              >
                <SelectValue placeholder="Choose a rate" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="11">11%</SelectItem>
                <SelectItem value="12">12%</SelectItem>
              </SelectContent>
            </Select>
            <p id="select-invalid-error" className="text-sm text-destructive">
              Choose a tax rate.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="select-disabled">Workspace currency</Label>
            <Select defaultValue="idr" disabled>
              <SelectTrigger id="select-disabled">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="idr">IDR</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </DocsSection>
    </>
  );
}
