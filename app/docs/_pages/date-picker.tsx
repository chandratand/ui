"use client";

import * as React from "react";
import { id } from "react-day-picker/locale";

import { Button } from "@/registry/chandratand/ui/button";
import { DatePicker } from "@/registry/chandratand/ui/date-picker";
import { Label } from "@/registry/chandratand/ui/label";
import { DocsSection } from "./section";

const code = "font-mono text-sm";

/** Label + DatePicker wired so the trigger's name reads "<label> <date or placeholder>". */
function LabelledDatePicker({
  id: fieldId,
  label,
  ...props
}: { id: string; label: string } & React.ComponentProps<typeof DatePicker>) {
  return (
    <div className="flex w-72 flex-col gap-2">
      <Label id={`${fieldId}-label`} htmlFor={fieldId}>
        {label}
      </Label>
      <DatePicker id={fieldId} aria-labelledby={`${fieldId}-label ${fieldId}`} {...props} />
    </div>
  );
}

export function DatePickerDocs() {
  const [due, setDue] = React.useState<Date>();
  const [paid, setPaid] = React.useState<Date | undefined>(new Date(2026, 10, 24));

  return (
    <>
      <DocsSection title="Default">
        <p className="text-muted-foreground">
          A form field that opens a Calendar. Enter or Space opens it on the selected day (or
          today); arrow keys move between days, Page Up and Page Down between months, Enter
          selects and returns focus to the field. Escape closes without a change.
        </p>
        <LabelledDatePicker id="due-date" label="Due date" value={due} onValueChange={setDue} />
      </DocsSection>

      <DocsSection title="Controlled">
        <p className="text-muted-foreground">
          Pass <code className={code}>value</code> and <code className={code}>onValueChange</code>{" "}
          to own the date, e.g. to clear it from outside.
        </p>
        <div className="flex items-end gap-2">
          <LabelledDatePicker
            id="paid-on"
            label="Paid on"
            value={paid}
            onValueChange={setPaid}
          />
          <Button variant="ghost" onClick={() => setPaid(undefined)} disabled={!paid}>
            Clear
          </Button>
        </div>
      </DocsSection>

      <DocsSection title="Indonesian locale">
        <p className="text-muted-foreground">
          <code className={code}>locale</code> and <code className={code}>displayFormat</code>{" "}
          are props; the defaults are en-US and <code className={code}>&quot;PPP&quot;</code>.
          Here <code className={code}>id</code> from{" "}
          <code className={code}>react-day-picker/locale</code> (date-fns&apos;s{" "}
          <code className={code}>id</code> plus translated screen reader labels; date-fns&apos;s
          own works too) and <code className={code}>&quot;EEEE, d MMMM yyyy&quot;</code>.
        </p>
        <div lang="id">
          <LabelledDatePicker
            id="tanggal-jatuh-tempo"
            label="Tanggal jatuh tempo"
            locale={id}
            displayFormat="EEEE, d MMMM yyyy"
            placeholder="Pilih tanggal"
          />
        </div>
      </DocsSection>

      <DocsSection title="Sizes">
        <p className="text-muted-foreground">
          The trigger takes <code className={code}>size</code>:{" "}
          <code className={code}>sm</code> 32px, <code className={code}>md</code> 40px (default),{" "}
          <code className={code}>lg</code> 48px, matching Input and Select.
        </p>
        <div className="flex flex-col gap-4">
          <LabelledDatePicker id="size-sm" label="Small" size="sm" />
          <LabelledDatePicker id="size-md" label="Medium" size="md" />
          <LabelledDatePicker id="size-lg" label="Large" size="lg" />
        </div>
      </DocsSection>

      <DocsSection title="States">
        <p className="text-muted-foreground">
          With a value, disabled, and invalid. Pair{" "}
          <code className={code}>aria-invalid</code> with an error message linked by{" "}
          <code className={code}>aria-describedby</code>.
        </p>
        <div className="flex flex-col gap-4">
          <LabelledDatePicker
            id="state-value"
            label="Start date"
            defaultValue={new Date(2026, 0, 5)}
          />
          <LabelledDatePicker id="state-disabled" label="End date" disabled />
          <div className="flex flex-col gap-2">
            <LabelledDatePicker
              id="state-invalid"
              label="Invoice date"
              aria-invalid
              aria-describedby="state-invalid-error"
            />
            <p id="state-invalid-error" className="text-sm text-destructive">
              Choose the invoice date.
            </p>
          </div>
        </div>
      </DocsSection>
    </>
  );
}
