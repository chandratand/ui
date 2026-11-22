"use client";

import { useState } from "react";
import { Copy, MoreHorizontal, Pencil, Send, Trash2 } from "lucide-react";

import { Button } from "@/registry/chandratand/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/registry/chandratand/ui/dropdown-menu";
import { DocsSection } from "./section";

const code = "font-mono text-sm";

export function DropdownMenuDocs() {
  const [columns, setColumns] = useState({ client: true, dueDate: true, notes: false });
  const [sort, setSort] = useState("newest");

  return (
    <>
      <DocsSection title="Usage">
        <p className="text-muted-foreground">
          A list of actions behind a button, such as row actions. For picking a form value, use
          Select. Arrow keys move through the items and Escape returns focus to the trigger. Put
          the destructive item last, after a separator.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Actions for invoice #1042">
                <MoreHorizontal aria-hidden />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-52">
              <DropdownMenuLabel>Invoice #1042</DropdownMenuLabel>
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <Pencil aria-hidden /> Edit <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Copy aria-hidden /> Duplicate
                </DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <Send aria-hidden /> Send as
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem>Email</DropdownMenuItem>
                    <DropdownMenuItem>WhatsApp</DropdownMenuItem>
                    <DropdownMenuItem>PDF download</DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">
                <Trash2 aria-hidden /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </DocsSection>

      <DocsSection title="Checkbox and radio items">
        <p className="text-muted-foreground">
          <code className={code}>DropdownMenuCheckboxItem</code> toggles an option and{" "}
          <code className={code}>DropdownMenuRadioGroup</code> picks one of several. Both are
          controlled: pass the state and its setter.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">View options</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-52">
              <DropdownMenuLabel>Columns</DropdownMenuLabel>
              <DropdownMenuCheckboxItem
                checked={columns.client}
                onCheckedChange={(checked) => setColumns({ ...columns, client: checked })}
              >
                Client
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={columns.dueDate}
                onCheckedChange={(checked) => setColumns({ ...columns, dueDate: checked })}
              >
                Due date
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={columns.notes}
                onCheckedChange={(checked) => setColumns({ ...columns, notes: checked })}
              >
                Notes
              </DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Sort by</DropdownMenuLabel>
              <DropdownMenuRadioGroup value={sort} onValueChange={setSort}>
                <DropdownMenuRadioItem value="newest">Newest first</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="oldest">Oldest first</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="amount">Amount</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </DocsSection>
    </>
  );
}
