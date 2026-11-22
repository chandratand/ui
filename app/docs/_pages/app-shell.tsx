import Link from "next/link";

import { DocsSection } from "./section";

const code = "font-mono text-sm";
const focusRing =
  "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

const usage = `"use client"; // e.g. components/app-frame.tsx in a Next.js app
import Link from "next/link";
import { usePathname } from "next/navigation";

export function AppFrame({ sidebarOpen, children }) {
  const pathname = usePathname();
  return (
    <AppShell
      appName="Acme Ltd"
      navigation={navigation} // { title, href, icon }[]
      currentHref={pathname}
      breadcrumbs={breadcrumbsFor(pathname)} // { title, href? }[], current page last
      linkComponent={Link}
      defaultSidebarOpen={sidebarOpen} // the sidebar_state cookie, read in the layout
    >
      {children}
    </AppShell>
  );
}`;

export function AppShellDocs() {
  return (
    <>
      <DocsSection title="Preview">
        <p className="text-muted-foreground">
          The shell fills the window, so it is shown in a frame. Press Tab inside it: the first
          stop is a &ldquo;Skip to content&rdquo; link. The header button (or{" "}
          <code className={code}>Ctrl/⌘ B</code>) collapses the Sidebar to its icons; their labels
          move to tooltips. Make the window narrower than 768px and the Sidebar opens as a Sheet
          instead, closing after you pick a page.{" "}
          <Link
            href="/preview/app-shell"
            className={`rounded-sm font-medium text-foreground underline underline-offset-4 ${focusRing}`}
          >
            Open the preview full screen
          </Link>
          .
        </p>
        <iframe
          src="/preview/app-shell"
          title="App shell preview"
          className="h-[36rem] w-full rounded-lg border border-border bg-background"
        />
      </DocsSection>

      <DocsSection title="Usage">
        <p className="text-muted-foreground">
          Installs <code className={code}>components/app-shell.tsx</code>. Render it once around
          every page that has navigation; leave it out of login and onboarding pages. Pass your
          router&apos;s <code className={code}>&lt;Link&gt;</code> as{" "}
          <code className={code}>linkComponent</code> (a plain{" "}
          <code className={code}>&lt;a&gt;</code> otherwise). The Sidebar item whose{" "}
          <code className={code}>href</code> equals <code className={code}>currentHref</code> is
          marked as the current page, and the last <code className={code}>breadcrumbs</code>{" "}
          entry is the page you are on; on a phone only that one shows. The page goes in{" "}
          <code className={code}>&lt;main&gt;</code>, so start it with its{" "}
          <code className={code}>&lt;h1&gt;</code>. Read the{" "}
          <code className={code}>sidebar_state</code> cookie on the server into{" "}
          <code className={code}>defaultSidebarOpen</code> to keep the Sidebar as the user left
          it. Groups, a footer or an account menu go straight into the copied file.
        </p>
        {/* Focusable: on a phone its long lines scroll sideways, and keyboards must reach that. */}
        <pre
          tabIndex={0}
          role="region"
          aria-label="Usage example"
          className={`overflow-x-auto rounded-md border border-border bg-muted p-4 font-mono text-sm ${focusRing}`}
        >
          <code>{usage}</code>
        </pre>
      </DocsSection>
    </>
  );
}
