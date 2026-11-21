"use client";

import { useState } from "react";
import { Calculator, Calendar, CreditCard, Settings, User } from "lucide-react";

import { Button } from "@/registry/chandratand/ui/button";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/registry/chandratand/ui/command";
import { DocsSection } from "./section";

function CommandItems() {
  return (
    <>
      <CommandEmpty>No results found.</CommandEmpty>
      <CommandGroup heading="Suggestions">
        <CommandItem>
          <Calendar aria-hidden /> Calendar
        </CommandItem>
        <CommandItem>
          <Calculator aria-hidden /> Calculator
        </CommandItem>
        <CommandItem disabled>
          <CreditCard aria-hidden /> Payments (disabled)
        </CommandItem>
      </CommandGroup>
      <CommandSeparator />
      <CommandGroup heading="Settings">
        <CommandItem>
          <User aria-hidden /> Profile
          <CommandShortcut>⌘P</CommandShortcut>
        </CommandItem>
        <CommandItem>
          <Settings aria-hidden /> Settings
          <CommandShortcut>⌘S</CommandShortcut>
        </CommandItem>
      </CommandGroup>
    </>
  );
}

export function CommandDocs() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <DocsSection title="Inline">
        <p className="text-muted-foreground">
          Type to filter; arrow keys move, Enter runs the highlighted item. Groups take a{" "}
          <code className="font-mono text-sm">heading</code>; an empty search shows{" "}
          <code className="font-mono text-sm">CommandEmpty</code>. To pick a form value, use
          Combobox.
        </p>
        <Command className="max-w-sm border border-border">
          <CommandInput placeholder="Type a command or search" aria-label="Search commands" />
          <CommandList>
            <CommandItems />
          </CommandList>
        </Command>
      </DocsSection>

      <DocsSection title="Dialog">
        <p className="text-muted-foreground">
          <code className="font-mono text-sm">CommandDialog</code> shows the same list as a
          command palette in a Dialog with a visually hidden title.
        </p>
        <div>
          <Button variant="outline" onClick={() => setOpen(true)}>
            Open command palette
          </Button>
        </div>
        <CommandDialog open={open} onOpenChange={setOpen}>
          <CommandInput placeholder="Type a command or search" aria-label="Search commands" />
          <CommandList>
            <CommandItems />
          </CommandList>
        </CommandDialog>
      </DocsSection>
    </>
  );
}
