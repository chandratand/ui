"use client";

import * as React from "react";
import { ChartColumn, FileText, LayoutDashboard, Users } from "lucide-react";

import {
  AppShell,
  type AppShellLinkProps,
  type AppShellNavItem,
} from "@/registry/chandratand/blocks/app-shell/components/app-shell";

const navigation: AppShellNavItem[] = [
  { title: "Dashboard", href: "#dashboard", icon: LayoutDashboard },
  { title: "Invoices", href: "#invoices", icon: FileText },
  { title: "Clients", href: "#clients", icon: Users },
  { title: "Reports", href: "#reports", icon: ChartColumn },
];

const NavigateContext = React.createContext<(href: string) => void>(() => {});

/** Stands in for a router's <Link>: navigates in state instead of loading the URL. */
function RouterLink({ href, onClick, ...props }: AppShellLinkProps) {
  const navigate = React.useContext(NavigateContext);
  return (
    <a
      {...props}
      href={href}
      onClick={(event) => {
        onClick?.(event);
        event.preventDefault();
        navigate(href);
      }}
    />
  );
}

export function AppShellPreview() {
  const [currentHref, setCurrentHref] = React.useState("#invoices");
  const current = navigation.find((item) => item.href === currentHref) ?? navigation[0];
  const home = navigation[0];

  return (
    <NavigateContext.Provider value={setCurrentHref}>
      <AppShell
        appName="Acme Ltd"
        navigation={navigation}
        currentHref={current.href}
        breadcrumbs={
          current === home
            ? [{ title: home.title }]
            : [{ title: home.title, href: home.href }, { title: current.title }]
        }
        linkComponent={RouterLink}
      >
        <h1 className="font-heading text-2xl font-semibold">{current.title}</h1>
        <p className="max-w-prose text-muted-foreground">
          The page goes here. It grows when the Sidebar collapses to its icons, and on a phone
          the Sidebar opens over it as a Sheet.
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          {["Outstanding", "Overdue", "Paid this month"].map((label) => (
            <div key={label} className="flex flex-col gap-1 rounded-lg border border-border p-4">
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className="font-heading text-xl font-semibold tabular-nums">—</p>
            </div>
          ))}
        </div>
      </AppShell>
    </NavigateContext.Provider>
  );
}
