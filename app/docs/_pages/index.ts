import type { ComponentType } from "react";

import { ButtonDocs } from "./button";
import { CalendarDocs } from "./calendar";
import { DatePickerDocs } from "./date-picker";
import { SheetDocs } from "./sheet";

/** Docs page body per registry item name. Items missing here 404 until they are migrated. */
export const docsPages: Record<string, ComponentType> = {
  button: ButtonDocs,
  calendar: CalendarDocs,
  "date-picker": DatePickerDocs,
  sheet: SheetDocs,
};
