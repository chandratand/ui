"use client";

import { useId, useMemo, useState } from "react";

import { DataTable } from "@/registry/chandratand/blocks/data-table/components/data-table";
import {
  type Invoice,
  type InvoiceStatus,
  invoiceColumns,
} from "@/registry/chandratand/blocks/data-table/components/invoice-columns";
import { Label } from "@/registry/chandratand/ui/label";
import { Switch } from "@/registry/chandratand/ui/switch";
import { DocsSection } from "./section";

const code = "font-mono text-sm";

const clients = [
  "Bumi Persada",
  "Cahaya Nusantara",
  "Karya Mandiri",
  "Maju Jaya",
  "Sinar Abadi Antara",
  "Tirta Utama",
];
const statuses: InvoiceStatus[] = ["Paid", "Sent", "Overdue", "Draft"];

const sampleInvoices: Invoice[] = Array.from({ length: 24 }, (_, index) => {
  const position = index + 1;
  return {
    id: String(position),
    number: `INV-${String(position).padStart(4, "0")}`,
    client: clients[(index * 5) % clients.length],
    status: statuses[index % statuses.length],
    due: `2026-${String((index % 12) + 1).padStart(2, "0")}-${String((index % 27) + 1).padStart(2, "0")}`,
    amount: 750_000 + ((index * 1_337_000) % 9_000_000),
  };
});

const clientOptions = clients.map((client) => ({ value: client, label: client }));

const usage = `const columns = useMemo(
  () => invoiceColumns({ onView: openInvoice, onMarkPaid: markPaid }),
  [],
);

<DataTable
  label="Invoices"
  columns={columns}
  data={invoices}
  loading={isLoading}
  filter={{ columnId: "client", label: "Client", allLabel: "All clients", options: clientOptions }}
/>`;

export function DataTableDocs() {
  const [invoices, setInvoices] = useState(sampleInvoices);
  const [loading, setLoading] = useState(false);
  const [lastAction, setLastAction] = useState("");
  const loadingId = useId();

  const columns = useMemo(
    () =>
      invoiceColumns({
        onView: (invoice) => setLastAction(`Opened ${invoice.number}.`),
        onMarkPaid: (invoice) => {
          setInvoices((current) =>
            current.map((item) => (item.id === invoice.id ? { ...item, status: "Paid" } : item)),
          );
          setLastAction(`Marked ${invoice.number} as paid.`);
        },
      }),
    [],
  );

  return (
    <>
      <DocsSection title="Preview">
        <p className="text-muted-foreground">
          Search by invoice number, client or status, or pick a client. A search that matches
          nothing shows the empty state with a way back. The line under the table announces the
          count, the page and loading. Each row&apos;s actions open from its menu button.
        </p>
        <div className="flex items-center gap-3">
          <Switch id={loadingId} checked={loading} onCheckedChange={setLoading} />
          <Label htmlFor={loadingId}>Show loading state</Label>
        </div>
        <DataTable
          label="Invoices"
          columns={columns}
          data={invoices}
          loading={loading}
          filter={{
            columnId: "client",
            label: "Client",
            allLabel: "All clients",
            options: clientOptions,
          }}
        />
        <p role="status" className="text-sm text-muted-foreground">
          {lastAction}
        </p>
      </DocsSection>

      <DocsSection title="Usage">
        <p className="text-muted-foreground">
          Installs <code className={code}>components/data-table.tsx</code>, a generic table, and{" "}
          <code className={code}>components/invoice-columns.tsx</code>, an example set of
          columns with a row actions menu. Write your own columns file per list, typed with{" "}
          <code className={code}>DataTableColumns&lt;YourRow&gt;</code>, and build them once with{" "}
          <code className={code}>useMemo</code>. Search covers every column with an accessor;
          turn one off with <code className={code}>enableGlobalFilter: false</code>. The filter
          column needs a <code className={code}>filterFn</code> that compares whole values. Set{" "}
          <code className={code}>meta.className</code> to align a column (amounts right).
          Filtering and paging run in the browser; for large lists, page on the server with
          TanStack&apos;s manual mode.
        </p>
        <pre className="overflow-x-auto rounded-md border border-border bg-muted p-4 font-mono text-sm">
          <code>{usage}</code>
        </pre>
      </DocsSection>
    </>
  );
}
