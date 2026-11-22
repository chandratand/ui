"use client";

import * as React from "react";
import {
  ChartColumn,
  Ellipsis,
  FileText,
  Inbox,
  LayoutDashboard,
  Plus,
  Settings,
  Users,
  type LucideIcon,
} from "lucide-react";

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
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@/registry/chandratand/ui/sidebar";
import { DocsSection } from "./section";

const pages: { label: string; icon: LucideIcon }[] = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Invoices", icon: FileText },
  { label: "Clients", icon: Users },
  { label: "Reports", icon: ChartColumn },
];

const code = (text: string) => <code className="font-mono text-sm">{text}</code>;

/** Stands in for a router's <Link>: navigates in state instead of loading the URL. */
function RouterLink({
  to,
  onNavigate,
  ...props
}: React.ComponentProps<"a"> & { to: string; onNavigate: (page: string) => void }) {
  return (
    <a
      {...props}
      href={`#${to.toLowerCase()}`}
      // Composes with an onClick passed through Slot (the Tooltip trigger), as a router Link does.
      onClick={(event) => {
        props.onClick?.(event);
        event.preventDefault();
        onNavigate(to);
      }}
    />
  );
}

function MainNav({ current, onNavigate }: { current: string; onNavigate: (page: string) => void }) {
  const { setOpenMobile } = useSidebar();
  const navigate = (page: string) => {
    onNavigate(page);
    setOpenMobile(false);
  };

  return (
    <nav aria-label="Main">
      <SidebarGroup>
        <SidebarGroupLabel>Workspace</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {pages.map(({ label, icon: Icon }) => (
              <SidebarMenuItem key={label}>
                <SidebarMenuButton asChild isActive={label === current} tooltip={label}>
                  <RouterLink to={label} onNavigate={navigate}>
                    <Icon aria-hidden />
                    <span>{label}</span>
                  </RouterLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </nav>
  );
}

function ShellPreview({
  variant,
  collapsible,
  defaultOpen,
  keyboardShortcut = false,
}: Pick<React.ComponentProps<typeof Sidebar>, "variant" | "collapsible"> &
  Pick<React.ComponentProps<typeof SidebarProvider>, "defaultOpen" | "keyboardShortcut">) {
  const [current, setCurrent] = React.useState("Invoices");

  return (
    <SidebarProvider
      defaultOpen={defaultOpen}
      keyboardShortcut={keyboardShortcut}
      className="relative min-h-[24rem] overflow-hidden rounded-lg border border-border"
    >
      {/* Absolute instead of fixed only so the preview stays inside its frame on this page. */}
      <Sidebar variant={variant} collapsible={collapsible} className="absolute h-full">
        <SidebarHeader>
          <SidebarInput type="search" aria-label="Search" placeholder="Search" />
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" tooltip="Acme Ltd">
                <Inbox aria-hidden />
                <span className="font-heading font-semibold">Acme Ltd</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <MainNav current={current} onNavigate={setCurrent} />
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Settings">
                <Settings aria-hidden />
                <span>Settings</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset asChild>
        <div>
          <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border px-3">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-1 data-[orientation=vertical]:h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="#home">Acme Ltd</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{current}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </header>
          <div className="flex flex-col gap-2 p-6">
            <p className="font-heading text-lg font-semibold">{current}</p>
            <p className="text-sm text-muted-foreground">
              The page beside the sidebar. It grows when the sidebar collapses.
            </p>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

function StaticSidebar({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider keyboardShortcut={false} className="min-h-0">
      <Sidebar collapsible="none" className="rounded-lg border border-border">
        <SidebarContent>{children}</SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );
}

const sizes = [
  { size: "sm", label: "Small, 32px" },
  { size: "md", label: "Medium, 36px (default)" },
  { size: "lg", label: "Large, 44px" },
] as const;

export function SidebarDocs() {
  return (
    <>
      <DocsSection title="Usage">
        <p className="text-muted-foreground">
          {code("SidebarProvider")} wraps the shell and holds the open state.{" "}
          {code("SidebarTrigger")} collapses and expands it (Enter or Space) and reports{" "}
          {code("aria-expanded")}; {code("Ctrl/⌘ B")} does the same. Off canvas, the collapsed
          sidebar leaves the tab order. Below 768px the sidebar opens as a Sheet instead, named by{" "}
          {code("label")}. Put the links in a {code('<nav aria-label="…">')} and pass your
          router&apos;s {code("<Link>")} to {code("SidebarMenuButton")} with {code("asChild")}.{" "}
          {code("isActive")} marks the current page with {code('aria-current="page"')}, a bar on
          its leading edge and a heavier weight, so it never relies on colour.
        </p>
        <ShellPreview keyboardShortcut="b" />
      </DocsSection>

      <DocsSection title="Collapse to icons">
        <p className="text-muted-foreground">
          {code('collapsible="icon"')} shrinks the sidebar to its icons instead of hiding it. Pass{" "}
          {code("tooltip")} to each item so its label still shows on hover and focus. With{" "}
          {code('collapsible="none"')} it stays open and has no trigger.
        </p>
        <ShellPreview collapsible="icon" defaultOpen={false} />
      </DocsSection>

      <DocsSection title="Variants">
        <p className="text-muted-foreground">
          {code("sidebar")} (default) sits flush against the edge with a border.{" "}
          {code("floating")} is a bordered panel inset from the edge; {code("inset")} puts the page
          in a bordered panel on a muted background. All three use borders, not shadows.
        </p>
        <div className="flex flex-col gap-6">
          <ShellPreview variant="floating" />
          <ShellPreview variant="inset" />
        </div>
      </DocsSection>

      <DocsSection title="Sizes">
        <p className="text-muted-foreground">
          {code("SidebarMenuButton")} and {code("SidebarMenuSubButton")} take {code("size")}:{" "}
          {code("sm")} 32px for dense apps, {code("md")} 36px (default), {code("lg")} 44px for
          touch. Collapsed to icons, every item is {code("md")}.
        </p>
        <StaticSidebar>
          {sizes.map(({ size, label }) => (
            <SidebarGroup key={size}>
              <SidebarGroupLabel>{label}</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton size={size}>
                    <FileText aria-hidden />
                    <span>Invoices</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
          ))}
        </StaticSidebar>
      </DocsSection>

      <DocsSection title="States">
        <p className="text-muted-foreground">
          The current page (here a nested item), a disabled item ({code("aria-disabled")} on a
          link, {code("disabled")} on a button), a count with {code("SidebarMenuBadge")}, an item
          action and a group action (each needs an {code("aria-label")}), and a loading menu with{" "}
          {code("SidebarMenuSkeleton")} under {code("aria-busy")}.
        </p>
        <StaticSidebar>
          <nav aria-label="States">
            <SidebarGroup>
              <SidebarGroupLabel>Workspace</SidebarGroupLabel>
              <SidebarGroupAction aria-label="Add client">
                <Plus aria-hidden />
              </SidebarGroupAction>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="#invoices">
                      <FileText aria-hidden />
                      <span>Invoices</span>
                    </a>
                  </SidebarMenuButton>
                  <SidebarMenuBadge>
                    12<span className="sr-only"> unpaid</span>
                  </SidebarMenuBadge>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="#clients">
                      <Users aria-hidden />
                      <span>Clients</span>
                    </a>
                  </SidebarMenuButton>
                  <SidebarMenuAction aria-label="More options for Clients">
                    <Ellipsis aria-hidden />
                  </SidebarMenuAction>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a aria-disabled="true" tabIndex={-1}>
                      <Inbox aria-hidden />
                      <span>Payroll</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="#reports">
                      <ChartColumn aria-hidden />
                      <span>Reports</span>
                    </a>
                  </SidebarMenuButton>
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton href="#monthly" isActive>
                        <span>Monthly</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton href="#yearly">
                        <span>Yearly</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
          </nav>
          <SidebarGroup>
            <SidebarGroupLabel>Loading</SidebarGroupLabel>
            <SidebarMenu aria-busy="true" aria-label="Projects, loading">
              {[0, 1, 2].map((index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuSkeleton showIcon />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </StaticSidebar>
      </DocsSection>
    </>
  );
}
