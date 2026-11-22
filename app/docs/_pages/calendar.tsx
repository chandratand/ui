"use client";

import * as React from "react";
import type { DateRange } from "react-day-picker";
import { id } from "react-day-picker/locale";

import { Calendar } from "@/registry/chandratand/ui/calendar";
import { Skeleton } from "@/registry/chandratand/ui/skeleton";
import { DocsSection } from "./section";

// "Today" differs between the prerendered HTML and the visitor's clock, so calendars render
// on the client only.
function ClientOnly({ children }: { children: React.ReactNode }) {
  const mounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  return mounted ? children : <Skeleton className="h-72 w-64" aria-hidden />;
}

const code = "font-mono text-sm";

export function CalendarDocs() {
  const [date, setDate] = React.useState<Date>();
  const [range, setRange] = React.useState<DateRange>();
  const [localized, setLocalized] = React.useState<Date>();
  const [booking, setBooking] = React.useState<Date>();
  const [birthday, setBirthday] = React.useState<Date>();

  return (
    <>
      <DocsSection title="Single date">
        <p className="text-muted-foreground">
          An always-visible month grid. Arrow keys move between days, Page Up and Page Down
          between months, Enter selects. For a form field, use{" "}
          <code className={code}>date-picker</code>, which opens this in a Popover.
        </p>
        <ClientOnly>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="w-fit rounded-lg border border-border"
          />
        </ClientOnly>
      </DocsSection>

      <DocsSection title="Range">
        <p className="text-muted-foreground">
          <code className={code}>mode=&quot;range&quot;</code> with two months side by side for
          check-in and check-out style picks.
        </p>
        <ClientOnly>
          <Calendar
            mode="range"
            numberOfMonths={2}
            selected={range}
            onSelect={setRange}
            className="w-fit rounded-lg border border-border"
          />
        </ClientOnly>
      </DocsSection>

      <DocsSection title="Locale">
        <p className="text-muted-foreground">
          Pass <code className={code}>locale</code>. Nothing is hardcoded: here{" "}
          <code className={code}>id</code> from{" "}
          <code className={code}>react-day-picker/locale</code>, which is date-fns&apos;s{" "}
          <code className={code}>id</code> plus translated screen reader labels. Weeks start on
          Monday, as the locale says.
        </p>
        <div lang="id">
          <ClientOnly>
            <Calendar
              mode="single"
              locale={id}
              selected={localized}
              onSelect={setLocalized}
              className="w-fit rounded-lg border border-border"
            />
          </ClientOnly>
        </div>
      </DocsSection>

      <DocsSection title="States">
        <p className="text-muted-foreground">
          Today has a quiet fill, the selected day the primary fill. Disabled days (here
          weekends and the past) are dimmed and skipped by the keyboard.
        </p>
        <ClientOnly>
          <Calendar
            mode="single"
            selected={booking}
            onSelect={setBooking}
            disabled={[{ dayOfWeek: [0, 6] }, { before: new Date() }]}
            className="w-fit rounded-lg border border-border"
          />
        </ClientOnly>
      </DocsSection>

      <DocsSection title="Month and year dropdowns">
        <p className="text-muted-foreground">
          <code className={code}>captionLayout=&quot;dropdown&quot;</code> for dates far from
          today, such as a birth date. Bound it with{" "}
          <code className={code}>startMonth</code> and <code className={code}>endMonth</code>.
        </p>
        <ClientOnly>
          <Calendar
            mode="single"
            captionLayout="dropdown"
            startMonth={new Date(1940, 0)}
            endMonth={new Date()}
            selected={birthday}
            onSelect={setBirthday}
            className="w-fit rounded-lg border border-border"
          />
        </ClientOnly>
      </DocsSection>
    </>
  );
}
