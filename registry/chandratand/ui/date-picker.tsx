"use client";

import * as React from "react";
import { format, type Locale } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/registry/chandratand/ui/button";
import { Calendar } from "@/registry/chandratand/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/registry/chandratand/ui/popover";

export interface DatePickerProps
  extends Omit<
    React.ComponentProps<typeof Button>,
    "value" | "defaultValue" | "onChange" | "size" | "variant" | "asChild" | "children"
  > {
  /** The selected date (controlled). */
  value?: Date;
  /** The initially selected date (uncontrolled). */
  defaultValue?: Date;
  /** Called with the picked date, or `undefined` when the selected day is picked again. */
  onValueChange?: (date: Date | undefined) => void;
  /** date-fns locale for the calendar and the trigger text, e.g. `id` from `react-day-picker/locale`. Default: en-US. */
  locale?: Locale;
  /** date-fns `format` pattern for the trigger text. Default `"PPP"` (localized long date). */
  displayFormat?: string;
  /** Trigger text while no date is selected. */
  placeholder?: string;
  size?: "sm" | "md" | "lg";
  /** Passed to the Calendar, e.g. `disabled` days, `startMonth`/`endMonth`, `captionLayout`. */
  calendarProps?: Omit<
    React.ComponentProps<typeof Calendar>,
    "mode" | "selected" | "onSelect" | "locale" | "required"
  >;
}

/**
 * A single-date form field: a trigger showing the formatted date that opens a Calendar in a
 * Popover. For an always-visible month grid, or for ranges, use Calendar directly.
 * Give it a visible Label; to have the selected date read out with the label, set
 * `aria-labelledby="<label id> <trigger id>"`.
 */
function DatePicker({
  value,
  defaultValue,
  onValueChange,
  locale,
  displayFormat = "PPP",
  placeholder = "Pick a date",
  size = "md",
  calendarProps,
  className,
  ...props
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue);
  const selected = value !== undefined ? value : uncontrolled;

  function handleSelect(date: Date | undefined) {
    setUncontrolled(date);
    onValueChange?.(date);
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size={size}
          data-slot="date-picker-trigger"
          data-empty={!selected}
          className={cn(
            "justify-start text-left font-normal",
            "data-[empty=true]:text-muted-foreground aria-invalid:border-destructive",
            className,
          )}
          {...props}
        >
          <CalendarIcon aria-hidden />
          <span className="truncate">
            {selected ? format(selected, displayFormat, { locale }) : placeholder}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        data-slot="date-picker-content"
        className="w-auto p-0"
        align="start"
        // Calendar moves focus to the selected day (or today) itself; Radix would pick the nav button.
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        <Calendar
          autoFocus
          defaultMonth={selected}
          {...calendarProps}
          mode="single"
          selected={selected}
          onSelect={handleSelect}
          locale={locale}
        />
      </PopoverContent>
    </Popover>
  );
}

export { DatePicker };
