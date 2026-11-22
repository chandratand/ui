"use client";

import { createColumnHelper, filterFn_equalsString } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import {
  dataTableFeatures,
  type DataTableColumns,
} from "@/registry/chandratand/blocks/data-table/components/data-table";
import { Badge, type BadgeProps } from "@/registry/chandratand/ui/badge";
import { Button } from "@/registry/chandratand/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/registry/chandratand/ui/dropdown-menu";

export type InvoiceStatus = "Draft" | "Sent" | "Paid" | "Overdue";

export type Invoice = {
  id: string;
  number: string;
  client: string;
  status: InvoiceStatus;
  /** ISO date, `YYYY-MM-DD`. */
  due: string;
  amount: number;
};

export interface InvoiceActions {
  onView: (invoice: Invoice) => void;
  onMarkPaid: (invoice: Invoice) => void;
}

const statusVariant: Record<InvoiceStatus, BadgeProps["variant"]> = {
  Draft: "neutral",
  Sent: "info",
  Paid: "success",
  Overdue: "destructive",
};

// UTC, so the server and the browser render the same day and hydration matches.
const dateFormat = new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeZone: "UTC" });
const amountFormat = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

const column = createColumnHelper<typeof dataTableFeatures, Invoice>();

/**
 * Columns for a list of invoices, with a row actions menu. A starting point: change the
 * record type, the cells and the actions to yours. Build them once (`useMemo`) so the table
 * keeps its state between renders.
 */
export function invoiceColumns({ onView, onMarkPaid }: InvoiceActions): DataTableColumns<Invoice> {
  return column.columns([
    column.accessor("number", {
      header: "Invoice",
      cell: (info) => <span className="font-mono">{info.getValue()}</span>,
    }),
    column.accessor("client", {
      header: "Client",
      filterFn: filterFn_equalsString,
    }),
    column.accessor("status", {
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={statusVariant[row.original.status]}>{row.original.status}</Badge>
      ),
    }),
    column.accessor("due", {
      header: "Due",
      enableGlobalFilter: false,
      cell: (info) => dateFormat.format(new Date(info.getValue())),
    }),
    column.accessor("amount", {
      header: "Amount",
      enableGlobalFilter: false,
      meta: { className: "text-right tabular-nums" },
      cell: (info) => amountFormat.format(info.getValue()),
    }),
    column.display({
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
      meta: { className: "w-px text-right" },
      cell: ({ row }) => {
        const invoice = row.original;
        return (
          // Non-modal: a modal menu aria-hides the page while its controls stay focusable.
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label={`Actions for ${invoice.number}`}>
                <MoreHorizontal aria-hidden />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => onView(invoice)}>View invoice</DropdownMenuItem>
              <DropdownMenuItem
                disabled={invoice.status === "Paid"}
                onSelect={() => onMarkPaid(invoice)}
              >
                Mark as paid
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    }),
  ]);
}
