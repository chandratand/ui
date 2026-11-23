"use client";

import * as React from "react";
import type { LucideIcon } from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/registry/chandratand/ui/breadcrumb";
import { Separator } from "@/registry/chandratand/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@/registry/chandratand/ui/sidebar";

export type AppShellLinkProps = React.ComponentProps<"a"> & { href: string };

type LinkComponent = React.ComponentType<AppShellLinkProps>;

export type AppShellNavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
};

export type AppShellCrumb = {
  title: string;
  /** Not needed on the last entry, the current page. Without it a level is plain text. */
  href?: string;
};

export interface AppShellProps {
  /** Product or workspace name at the top of the Sidebar. */
  appName: string;
  /** The Sidebar's links, top to bottom. */
  navigation: AppShellNavItem[];
  /** `href` of the page on screen; its Sidebar item is marked as the current page. */
  currentHref: string;
  /** Location trail, top level first. The last entry is the current page. */
  breadcrumbs: AppShellCrumb[];
  /** Renders every link. Pass your router's `<Link>`; default a plain `<a>`. */
  linkComponent?: LinkComponent;
  /** Initial Sidebar state. Read the `sidebar_state` cookie on the server to restore it. */
  defaultSidebarOpen?: boolean;
  /** The page. Rendered inside `<main>`; give it the page's `<h1>`. */
  children: React.ReactNode;
}

const mainId = "main-content";

const focusRing =
  "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

function PlainLink(props: AppShellLinkProps) {
  return <a {...props} />;
}

/**
 * The frame of a Consumer app: Sidebar navigation that collapses to icons (Ctrl/⌘ B or the
 * header button), a header with the Breadcrumb, and the page in `<main>`. A skip link is
 * the first stop in the tab order. Below 768px the Sidebar opens as a Sheet that closes after
 * navigating. Render it once in the root layout; copy it and change the header, Sidebar
 * groups and footer to your app. For a page without navigation (login, onboarding), leave it out.
 */
export function AppShell({
  appName,
  navigation,
  currentHref,
  breadcrumbs,
  linkComponent: Link = PlainLink,
  defaultSidebarOpen = true,
  children,
}: AppShellProps) {
  return (
    <SidebarProvider defaultOpen={defaultSidebarOpen}>
      <a
        href={`#${mainId}`}
        className={`sr-only z-50 rounded-md border border-border bg-popover text-sm font-medium text-popover-foreground focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:flex focus:h-control-md focus:items-center focus:px-3 ${focusRing}`}
      >
        Skip to content
      </a>
      <Sidebar collapsible="icon" label="Navigation">
        <SidebarHeader>
          <div className="flex h-control-lg items-center gap-2 px-2">
            <span
              aria-hidden
              className="flex size-6 shrink-0 items-center justify-center rounded-sm bg-primary font-heading text-xs font-semibold text-primary-foreground"
            >
              {appName.charAt(0)}
            </span>
            <span className="truncate font-heading font-semibold group-data-[collapsible=icon]:hidden">
              {appName}
            </span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <AppNavigation navigation={navigation} currentHref={currentHref} Link={Link} />
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
      <SidebarInset asChild>
        <div>
          <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b border-border bg-background px-3">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-1 data-[orientation=vertical]:h-4" />
            <AppBreadcrumb breadcrumbs={breadcrumbs} Link={Link} />
          </header>
          {/* Focusable only as the skip link's target, not a control, so it shows no ring. */}
          <main id={mainId} tabIndex={-1} className="flex flex-1 flex-col gap-6 p-4 outline-none md:p-6">
            {children}
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

function AppNavigation({
  navigation,
  currentHref,
  Link,
}: {
  navigation: AppShellNavItem[];
  currentHref: string;
  Link: LinkComponent;
}) {
  const { setOpenMobile } = useSidebar();

  return (
    <nav aria-label="Primary">
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            {navigation.map(({ title, href, icon: Icon }) => (
              <SidebarMenuItem key={href}>
                <SidebarMenuButton asChild isActive={href === currentHref} tooltip={title}>
                  <Link href={href} onClick={() => setOpenMobile(false)}>
                    <Icon aria-hidden />
                    <span>{title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </nav>
  );
}

function AppBreadcrumb({
  breadcrumbs,
  Link,
}: {
  breadcrumbs: AppShellCrumb[];
  Link: LinkComponent;
}) {
  const lastIndex = breadcrumbs.length - 1;

  return (
    <Breadcrumb className="min-w-0">
      <BreadcrumbList>
        {breadcrumbs.map(({ title, href }, index) => (
          <React.Fragment key={`${index}-${title}`}>
            {/* On a phone only the current page fits beside the trigger. */}
            {index > 0 && <BreadcrumbSeparator className="max-md:hidden" />}
            <BreadcrumbItem className={index < lastIndex ? "max-md:hidden" : "min-w-0"}>
              {index === lastIndex ? (
                <BreadcrumbPage className="truncate">{title}</BreadcrumbPage>
              ) : href ? (
                <BreadcrumbLink asChild>
                  <Link href={href}>{title}</Link>
                </BreadcrumbLink>
              ) : (
                title
              )}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
