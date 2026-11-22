import type { Metadata } from "next";

import { AppShellPreview } from "./preview";

export const metadata: Metadata = { title: "App shell preview — chandratand/ui" };

/** Full-page preview of the app-shell Block; `/docs/app-shell` shows it in an iframe. */
export default function AppShellPreviewPage() {
  return <AppShellPreview />;
}
