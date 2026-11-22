"use client";

import * as React from "react";
import {
  columnFilteringFeature,
  createFilteredRowModel,
  createPaginatedRowModel,
  globalFilteringFeature,
  rowPaginationFeature,
  tableFeatures,
  useTable,
  type ColumnDef,
  type RowData,
} from "@tanstack/react-table";
import { SearchX } from "lucide-react";

import { Button } from "@/registry/chandratand/ui/button";
import { Combobox, type ComboboxOption } from "@/registry/chandratand/ui/combobox";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/registry/chandratand/ui/empty";
import { Input } from "@/registry/chandratand/ui/input";
import { Label } from "@/registry/chandratand/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/registry/chandratand/ui/pagination";
import { Spinner } from "@/registry/chandratand/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/registry/chandratand/ui/table";

export interface DataTableColumnMeta {
  /** Applied to the column's header and cells, e.g. `"text-right tabular-nums"` for amounts. */
  className?: string;
}

/** The TanStack features every DataTable uses. Type your columns with `DataTableColumns`. */
export const dataTableFeatures = tableFeatures({
  columnFilteringFeature,
  globalFilteringFeature,
  rowPaginationFeature,
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  columnMeta: {} as DataTableColumnMeta,
});

// `any` value type: each column holds a different one (string, number, none for actions).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DataTableColumns<TData extends RowData> = ColumnDef<typeof dataTableFeatures, TData, any>[];

export interface DataTableFilter {
  /**
   * Id of the column to filter. Give that column a `filterFn` that compares whole values
   * (`filterFn_equalsString`), or "Sinar" would also match "Sinar Abadi".
   */
  columnId: string;
  /** Visible label of the Combobox, e.g. "Client". */
  label: string;
  /** The first option, which clears the filter, e.g. "All clients". */
  allLabel: string;
  options: ComboboxOption[];
}

export interface DataTableProps<TData extends RowData> {
  columns: DataTableColumns<TData>;
  data: TData[];
  /** Names the table, plural ("Invoices"); its messages use it in lower case. */
  label: string;
  /** Replaces the rows with a Spinner and announces "Loading <label>". */
  loading?: boolean;
  /** Visible label of the search field. Default "Search <label>". */
  searchLabel?: string;
  /** One column to filter with a Combobox. Columns with an accessor are searched. */
  filter?: DataTableFilter;
  /** Rows per page. Default 10. */
  pageSize?: number;
  /** Shown when `data` is empty (not when a search matches nothing), e.g. with a "Create" action. */
  empty?: React.ReactNode;
  density?: "comfortable" | "compact";
}

/**
 * A list of records the user searches, filters and pages through on the client: search over
 * every accessor column, an optional Combobox filter on one column, Pagination, and loading
 * and empty states. The line under the table is a polite live region, so result counts,
 * page changes and loading are announced. Copy it and change it; columns (with row actions)
 * live in their own file, see `invoice-columns.tsx`. For more rows than the browser should
 * hold, fetch per page on the server and use TanStack's manual filtering and pagination.
 */
export function DataTable<TData extends RowData>({
  columns,
  data,
  label,
  loading = false,
  searchLabel = `Search ${label.toLowerCase()}`,
  filter,
  pageSize = 10,
  empty,
  density,
}: DataTableProps<TData>) {
  const table = useTable({
    features: dataTableFeatures,
    columns,
    data,
    initialState: { globalFilter: "", pagination: { pageIndex: 0, pageSize } },
    // Updating a row in `data` would otherwise jump to page 1 and drop the focus held in it.
    // A new search or filter goes back to page 1 in its own handler instead.
    autoResetPageIndex: false,
  });
  const searchId = React.useId();
  const filterId = React.useId();
  const searchRef = React.useRef<HTMLInputElement>(null);

  const noun = label.toLowerCase();
  const filterColumn = filter ? table.getColumn(filter.columnId) : undefined;
  const filterValue = (filterColumn?.getFilterValue() as string | undefined) ?? "";
  const searchValue = (table.state.globalFilter as string | undefined) ?? "";
  const matchCount = table.getFilteredRowModel().rows.length;
  const rows = table.getRowModel().rows;
  const columnCount = table.getAllLeafColumns().length;
  const { pageIndex, pageSize: rowsPerPage } = table.state.pagination;
  const pageCount = table.getPageCount();
  const firstShown = pageIndex * rowsPerPage + 1;
  const lastShown = Math.min(matchCount, firstShown + rowsPerPage - 1);

  // Removing rows can leave the current page past the end.
  React.useEffect(() => {
    if (pageIndex > 0 && pageIndex >= pageCount) table.setPageIndex(Math.max(0, pageCount - 1));
  }, [pageIndex, pageCount, table]);

  const summary = loading
    ? `Loading ${noun}`
    : data.length === 0
      ? `No ${noun} yet`
      : matchCount === 0
        ? `No ${noun} match`
        : `Showing ${firstShown}–${lastShown} of ${matchCount}`;

  function search(value: string) {
    table.setGlobalFilter(value);
    table.setPageIndex(0);
  }

  function filterBy(value: string) {
    filterColumn?.setFilterValue(value || undefined);
    table.setPageIndex(0);
  }

  function clearSearchAndFilter() {
    table.setGlobalFilter("");
    table.resetColumnFilters(true);
    table.setPageIndex(0);
    // The button that called this unmounts with the empty state.
    searchRef.current?.focus();
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex w-full flex-col gap-2 sm:w-64">
          <Label htmlFor={searchId}>{searchLabel}</Label>
          <Input
            ref={searchRef}
            id={searchId}
            type="search"
            autoComplete="off"
            value={searchValue}
            onChange={(event) => search(event.target.value)}
          />
        </div>
        {filter && filterColumn && (
          <div className="flex w-full flex-col gap-2 sm:w-56">
            <Label htmlFor={filterId}>{filter.label}</Label>
            <Combobox
              id={filterId}
              options={[{ value: "", label: filter.allLabel }, ...filter.options]}
              value={filterValue}
              onValueChange={filterBy}
              searchPlaceholder={`Search ${filter.label.toLowerCase()}`}
            />
          </div>
        )}
      </div>

      <div className="rounded-lg border border-border">
        <Table aria-label={label} aria-busy={loading || undefined} density={density}>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className={header.column.columnDef.meta?.className}>
                    {header.isPlaceholder ? null : <table.FlexRender header={header} />}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={columnCount} className="h-40">
                  <div className="flex justify-center text-muted-foreground">
                    {/* The live region below says it; the Spinner only shows it. */}
                    <Spinner aria-hidden />
                  </div>
                </TableCell>
              </TableRow>
            ) : rows.length > 0 ? (
              rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getAllCells().map((cell) => (
                    <TableCell key={cell.id} className={cell.column.columnDef.meta?.className}>
                      <table.FlexRender cell={cell} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={columnCount} className="h-auto p-0">
                  {data.length === 0 && empty ? (
                    empty
                  ) : (
                    <Empty>
                      <EmptyHeader>
                        <EmptyMedia variant="icon">
                          <SearchX aria-hidden />
                        </EmptyMedia>
                        <EmptyTitle>{summary}</EmptyTitle>
                        {data.length > 0 && (
                          <EmptyDescription>Try another search or filter.</EmptyDescription>
                        )}
                      </EmptyHeader>
                      {data.length > 0 && (
                        <EmptyContent>
                          <Button variant="outline" onClick={clearSearchAndFilter}>
                            Clear search and filter
                          </Button>
                        </EmptyContent>
                      )}
                    </Empty>
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p role="status" className="text-sm text-muted-foreground tabular-nums">
          {summary}
        </p>
        {!loading && pageCount > 1 && (
          <Pagination aria-label={`${label} pages`} className="mx-0 w-auto">
            <PaginationContent>
              <PaginationItem>
                {/* aria-disabled, not disabled: a disabled button drops the focus it holds. */}
                <PaginationPrevious asChild aria-disabled={!table.getCanPreviousPage() || undefined}>
                  <button
                    type="button"
                    onClick={() => {
                      if (table.getCanPreviousPage()) table.previousPage();
                    }}
                  />
                </PaginationPrevious>
              </PaginationItem>
              {pageWindow(pageIndex, pageCount).map((page, index) =>
                page === "gap" ? (
                  <PaginationItem key={`gap-${index}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={page}>
                    <PaginationLink asChild isActive={page === pageIndex}>
                      <button
                        type="button"
                        aria-label={`Page ${page + 1}`}
                        onClick={() => table.setPageIndex(page)}
                      >
                        {page + 1}
                      </button>
                    </PaginationLink>
                  </PaginationItem>
                ),
              )}
              <PaginationItem>
                <PaginationNext asChild aria-disabled={!table.getCanNextPage() || undefined}>
                  <button
                    type="button"
                    onClick={() => {
                      if (table.getCanNextPage()) table.nextPage();
                    }}
                  />
                </PaginationNext>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
}

/** Zero-based page indexes to show: the first, the last and the current one with its neighbours. */
function pageWindow(current: number, count: number): (number | "gap")[] {
  if (count <= 7) return Array.from({ length: count }, (_, index) => index);
  const shown = [...new Set([0, current - 1, current, current + 1, count - 1])]
    .filter((page) => page >= 0 && page < count)
    .sort((a, b) => a - b);
  return shown.flatMap((page, index) =>
    index > 0 && page - shown[index - 1] > 1 ? (["gap", page] as const) : [page],
  );
}
