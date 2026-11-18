import type { ComponentType } from "react";

import { ButtonDocs } from "./button";
import { CalendarDocs } from "./calendar";
import { DatePickerDocs } from "./date-picker";
import { FieldDocs } from "./field";
import { ProgressDocs } from "./progress";
import { AccordionDocs } from "./accordion";
import { ScrollAreaDocs } from "./scroll-area";
import { SheetDocs } from "./sheet";
import { EmptyDocs } from "./empty";
import { PaginationDocs } from "./pagination";
import { SpinnerDocs } from "./spinner";

/** Docs page body per registry item name. Items missing here 404 until they are migrated. */
export const docsPages: Record<string, ComponentType> = {
  button: ButtonDocs,
  calendar: CalendarDocs,
  "date-picker": DatePickerDocs,
  field: FieldDocs,
  progress: ProgressDocs,
  accordion: AccordionDocs,
  "scroll-area": ScrollAreaDocs,
  sheet: SheetDocs,
  pagination: PaginationDocs,
  spinner: SpinnerDocs,
  empty: EmptyDocs,
};
