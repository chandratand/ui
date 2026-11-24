"use client";

import { useState } from "react";

import { Combobox, type ComboboxOption } from "@/registry/chandratand/ui/combobox";
import { Label } from "@/registry/chandratand/ui/label";
import { DocsSection } from "./section";

const clients: ComboboxOption[] = [
  { value: "andalan", label: "Andalan Logistik" },
  { value: "bumi", label: "Bumi Persada" },
  { value: "cahaya", label: "Cahaya Mandiri" },
  { value: "duta", label: "Duta Kreasi" },
  { value: "sinar", label: "Sinar Abadi Antara" },
  { value: "tirta", label: "Tirta Utama", disabled: true },
];

const clientProps = {
  options: clients,
  placeholder: "Select a client",
  searchPlaceholder: "Search clients",
  emptyMessage: "No clients found.",
};

export function ComboboxDocs() {
  const [client, setClient] = useState("");

  return (
    <>
      <DocsSection title="Usage">
        <p className="text-muted-foreground">
          Opens with Enter, Space, the arrow keys or a click; typing filters, arrow keys move,
          Enter picks and Escape closes, returning focus to the trigger. Pair it with a{" "}
          <code className="font-mono text-sm">Label</code> whose{" "}
          <code className="font-mono text-sm">htmlFor</code> matches its{" "}
          <code className="font-mono text-sm">id</code>.
        </p>
        <div className="flex max-w-xs flex-col gap-2">
          <Label htmlFor="combobox-client">Client</Label>
          <Combobox
            id="combobox-client"
            {...clientProps}
            value={client}
            onValueChange={setClient}
          />
          <p className="text-sm text-muted-foreground">
            Selected value: <code className="font-mono">{client || "none"}</code>
          </p>
        </div>
      </DocsSection>

      <DocsSection title="Sizes">
        <p className="text-muted-foreground">
          Same heights as Select: <code className="font-mono text-sm">sm</code> 32px,{" "}
          <code className="font-mono text-sm">md</code> 40px (default),{" "}
          <code className="font-mono text-sm">lg</code> 48px.
        </p>
        <div className="flex max-w-xs flex-col gap-4">
          {(["sm", "md", "lg"] as const).map((size) => (
            <div key={size} className="flex flex-col gap-2">
              <Label htmlFor={`combobox-size-${size}`}>Client ({size})</Label>
              <Combobox id={`combobox-size-${size}`} size={size} {...clientProps} />
            </div>
          ))}
        </div>
      </DocsSection>

      <DocsSection title="States">
        <p className="text-muted-foreground">
          A preselected value, an invalid field with its message linked through{" "}
          <code className="font-mono text-sm">aria-describedby</code>, and a disabled field.
          Disabled options stay visible but cannot be picked.
        </p>
        <div className="flex max-w-xs flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="combobox-preselected">Billing client</Label>
            <Combobox id="combobox-preselected" defaultValue="bumi" {...clientProps} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="combobox-invalid">Invoice client</Label>
            <Combobox
              id="combobox-invalid"
              aria-invalid
              aria-describedby="combobox-invalid-error"
              {...clientProps}
            />
            <p id="combobox-invalid-error" className="text-sm text-destructive">
              Choose a client.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="combobox-disabled">Archived client</Label>
            <Combobox id="combobox-disabled" disabled {...clientProps} />
          </div>
        </div>
      </DocsSection>
    </>
  );
}
