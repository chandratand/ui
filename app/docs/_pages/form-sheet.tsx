"use client";

import { useState } from "react";

import {
  ClientFormSheet,
  type ClientValues,
} from "@/registry/chandratand/blocks/form-sheet/components/client-form-sheet";
import { DocsSection } from "./section";

const code = "font-mono text-sm";

const existingClient: ClientValues = {
  name: "PT Sinar Jaya",
  email: "finance@sinarjaya.co.id",
  notes: "Net 30.",
};

const usage = `<ClientFormSheet onSave={(client) => createClient(client)} />
<ClientFormSheet client={client} onSave={(client) => updateClient(id, client)} />`;

export function FormSheetDocs() {
  const [saved, setSaved] = useState<string | null>(null);
  const save = (values: ClientValues) => setSaved(values.name);

  return (
    <>
      <DocsSection title="Preview">
        <p className="text-muted-foreground">
          Save with an empty or wrong field: the error shows on that field, is announced, and
          focus moves to it. Fix it and save again; the sheet closes and focus returns to the
          button that opened it.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <ClientFormSheet onSave={save} />
          <ClientFormSheet client={existingClient} onSave={save} />
          <p role="status" className="text-sm text-muted-foreground">
            {saved && `Saved ${saved}.`}
          </p>
        </div>
      </DocsSection>

      <DocsSection title="Usage">
        <p className="text-muted-foreground">
          Installs <code className={code}>components/client-form-sheet.tsx</code>. Without{" "}
          <code className={code}>client</code> it adds; with it, it edits.{" "}
          <code className={code}>onSave</code> gets the trimmed values only once they are
          valid. Pass <code className={code}>trigger</code> to open it from your own button.
          The fields and rules are a starting point: change them to your record. It uses no
          form library; with react-hook-form, follow the Field docs.
        </p>
        <pre className="overflow-x-auto rounded-md border border-border bg-muted p-4 font-mono text-sm">
          <code>{usage}</code>
        </pre>
      </DocsSection>
    </>
  );
}
