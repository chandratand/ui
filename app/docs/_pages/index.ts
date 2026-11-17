import type { ComponentType } from "react";

import { ButtonDocs } from "./button";
import { ProgressDocs } from "./progress";
import { AccordionDocs } from "./accordion";
import { ScrollAreaDocs } from "./scroll-area";
import { SheetDocs } from "./sheet";

/** Docs page body per registry item name. Items missing here 404 until they are migrated. */
export const docsPages: Record<string, ComponentType> = {
  button: ButtonDocs,
  progress: ProgressDocs,
  accordion: AccordionDocs,
  "scroll-area": ScrollAreaDocs,
  sheet: SheetDocs,
};
