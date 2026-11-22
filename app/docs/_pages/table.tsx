import { CircleCheck, TriangleAlert } from "lucide-react";

import { Badge } from "@/registry/chandratand/ui/badge";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  type TableProps,
} from "@/registry/chandratand/ui/table";
import { DocsSection } from "./section";

const code = "font-mono text-sm";

const invoices = [
  { id: "INV-1042", client: "PT Contoh Jaya", paid: true, amount: "Rp 4.250.000" },
  { id: "INV-1043", client: "CV Maju Bersama", paid: false, amount: "Rp 1.800.000" },
  { id: "INV-1044", client: "Toko Sinar", paid: true, amount: "Rp 920.000" },
];

function InvoiceTable({ caption, density }: { caption: string } & Pick<TableProps, "density">) {
  return (
    <div className="rounded-lg border border-border">
      <Table density={density}>
        <TableCaption className="mb-3">{caption}</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right tabular-nums">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell className="font-mono">{invoice.id}</TableCell>
              <TableCell>{invoice.client}</TableCell>
              <TableCell>
                {invoice.paid ? (
                  <Badge variant="success">
                    <CircleCheck aria-hidden /> Paid
                  </Badge>
                ) : (
                  <Badge variant="warning">
                    <TriangleAlert aria-hidden /> Due
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-right tabular-nums">{invoice.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export function TableDocs() {
  return (
    <>
      <DocsSection title="Usage">
        <p className="text-muted-foreground">
          For data people compare across rows. Name it with a{" "}
          <code className={code}>TableCaption</code>. Right-align numbers with{" "}
          <code className={code}>text-right tabular-nums</code> on both the head and the cells, so
          digits line up.
        </p>
        <InvoiceTable caption="Recent invoices" />
      </DocsSection>

      <DocsSection title="Density">
        <p className="text-muted-foreground">
          <code className={code}>comfortable</code> 40px rows (default);{" "}
          <code className={code}>compact</code> 32px rows for dense back-office screens.
        </p>
        <InvoiceTable caption="Recent invoices, compact" density="compact" />
      </DocsSection>
    </>
  );
}
