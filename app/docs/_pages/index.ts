import type { ComponentType } from "react";

import { AccordionDocs } from "./accordion";
import { AlertDocs } from "./alert";
import { AlertDialogDocs } from "./alert-dialog";
import { AvatarDocs } from "./avatar";
import { BadgeDocs } from "./badge";
import { BreadcrumbDocs } from "./breadcrumb";
import { ButtonDocs } from "./button";
import { CalendarDocs } from "./calendar";
import { CardDocs } from "./card";
import { CheckboxDocs } from "./checkbox";
import { ComboboxDocs } from "./combobox";
import { CommandDocs } from "./command";
import { DatePickerDocs } from "./date-picker";
import { DialogDocs } from "./dialog";
import { DropdownMenuDocs } from "./dropdown-menu";
import { EmptyDocs } from "./empty";
import { FieldDocs } from "./field";
import { FormSheetDocs } from "./form-sheet";
import { InputDocs } from "./input";
import { LabelDocs } from "./label";
import { PaginationDocs } from "./pagination";
import { PopoverDocs } from "./popover";
import { ProgressDocs } from "./progress";
import { RadioGroupDocs } from "./radio-group";
import { ScrollAreaDocs } from "./scroll-area";
import { SelectDocs } from "./select";
import { SeparatorDocs } from "./separator";
import { SheetDocs } from "./sheet";
import { SidebarDocs } from "./sidebar";
import { SkeletonDocs } from "./skeleton";
import { SonnerDocs } from "./sonner";
import { SpinnerDocs } from "./spinner";
import { SwitchDocs } from "./switch";
import { TableDocs } from "./table";
import { TabsDocs } from "./tabs";
import { TextareaDocs } from "./textarea";
import { TooltipDocs } from "./tooltip";

/** Docs page body per registry item name. An item missing here 404s and fails the suite. */
export const docsPages: Record<string, ComponentType> = {
  accordion: AccordionDocs,
  alert: AlertDocs,
  "alert-dialog": AlertDialogDocs,
  avatar: AvatarDocs,
  badge: BadgeDocs,
  breadcrumb: BreadcrumbDocs,
  button: ButtonDocs,
  calendar: CalendarDocs,
  card: CardDocs,
  checkbox: CheckboxDocs,
  combobox: ComboboxDocs,
  command: CommandDocs,
  "date-picker": DatePickerDocs,
  dialog: DialogDocs,
  "dropdown-menu": DropdownMenuDocs,
  empty: EmptyDocs,
  field: FieldDocs,
  "form-sheet": FormSheetDocs,
  input: InputDocs,
  label: LabelDocs,
  pagination: PaginationDocs,
  popover: PopoverDocs,
  progress: ProgressDocs,
  "radio-group": RadioGroupDocs,
  "scroll-area": ScrollAreaDocs,
  select: SelectDocs,
  separator: SeparatorDocs,
  sheet: SheetDocs,
  sidebar: SidebarDocs,
  skeleton: SkeletonDocs,
  sonner: SonnerDocs,
  spinner: SpinnerDocs,
  switch: SwitchDocs,
  table: TableDocs,
  tabs: TabsDocs,
  textarea: TextareaDocs,
  tooltip: TooltipDocs,
};
