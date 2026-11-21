"use client";

import * as React from "react";
import { cva } from "class-variance-authority";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/registry/chandratand/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/registry/chandratand/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/registry/chandratand/ui/popover";

export interface ComboboxOption {
  value: string;
  /** What the user sees and searches. Must be unique: cmdk keys its items by it. */
  label: string;
  disabled?: boolean;
}

// Button's outline variant reshaped to match SelectTrigger, so both sit in a form side by side.
const comboboxTriggerVariants = cva(
  [
    "w-full min-w-0 justify-between px-3 font-normal text-foreground",
    "data-[placeholder]:text-muted-foreground aria-invalid:border-destructive",
    "[&>span]:truncate",
  ],
  {
    variants: {
      size: { sm: "", md: "", lg: "px-4" },
    },
    defaultVariants: { size: "md" },
  },
);

export interface ComboboxProps
  extends Omit<React.ComponentProps<"button">, "value" | "defaultValue" | "onChange"> {
  options: ComboboxOption[];
  /** Controlled selected value. */
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Trigger text while nothing is selected. */
  placeholder?: string;
  /** Placeholder and accessible name of the search field. */
  searchPlaceholder?: string;
  /** Shown when the search matches no option. */
  emptyMessage?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  /** Class names for the popover panel (the trigger takes `className`). */
  contentClassName?: string;
}

/**
 * Pick one value from a long list by searching (clients, products). Built on Command in a Popover.
 * For ≤ ~15 options without search, use Select. Give it a `<Label htmlFor>` matching its `id`.
 */
function Combobox({
  options,
  value: valueProp,
  defaultValue = "",
  onValueChange,
  placeholder = "Select an option",
  searchPlaceholder = "Search",
  emptyMessage = "No results found.",
  size = "md",
  className,
  contentClassName,
  onKeyDown,
  ...props
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue);
  const value = valueProp ?? uncontrolledValue;
  const selected = options.find((option) => option.value === value);

  function select(next: string) {
    if (valueProp === undefined) setUncontrolledValue(next);
    onValueChange?.(next);
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          data-slot="combobox-trigger"
          data-placeholder={selected ? undefined : ""}
          variant="outline"
          size={size}
          role="combobox"
          aria-expanded={open}
          className={cn(comboboxTriggerVariants({ size }), className)}
          onKeyDown={(event) => {
            onKeyDown?.(event);
            // The ARIA combobox pattern opens on the arrow keys too, not only Enter and Space.
            if (!event.defaultPrevented && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
              event.preventDefault();
              setOpen(true);
            }
          }}
          {...props}
        >
          <span>{selected ? selected.label : placeholder}</span>
          <ChevronsUpDown aria-hidden className="text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        data-slot="combobox-content"
        align="start"
        className={cn("w-(--radix-popover-trigger-width) min-w-[12rem] p-0", contentClassName)}
      >
        {/* Opening highlights the current value, so Enter right away keeps it. */}
        <Command defaultValue={selected?.label}>
          <CommandInput placeholder={searchPlaceholder} aria-label={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.label}
                  disabled={option.disabled}
                  onSelect={() => select(option.value)}
                >
                  {option.label}
                  <Check
                    aria-hidden
                    className={cn("ml-auto", option.value === value ? "opacity-100" : "opacity-0")}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export { Combobox, comboboxTriggerVariants };
