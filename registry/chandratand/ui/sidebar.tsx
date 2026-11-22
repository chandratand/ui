"use client";

import * as React from "react";
import { Slot } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import { PanelLeft } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/registry/chandratand/ui/button";
import { Input } from "@/registry/chandratand/ui/input";
import { Separator } from "@/registry/chandratand/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/registry/chandratand/ui/sheet";
import { Skeleton } from "@/registry/chandratand/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/registry/chandratand/ui/tooltip";

const SIDEBAR_COOKIE_NAME = "sidebar_state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = "16rem";
const SIDEBAR_WIDTH_MOBILE = "18rem";
// One md control plus the group's padding on each side.
const SIDEBAR_WIDTH_ICON = "calc(var(--control-md) + 1rem)";
// Below Tailwind's `md` breakpoint (48rem) the sidebar becomes a Sheet.
const MOBILE_QUERY = "(width < 48rem)";

const focusRing =
  "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

function subscribeToMobile(onChange: () => void) {
  const query = window.matchMedia(MOBILE_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function useIsMobile() {
  return React.useSyncExternalStore(
    subscribeToMobile,
    () => window.matchMedia(MOBILE_QUERY).matches,
    () => false,
  );
}

type SidebarContextProps = {
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
  /** Where focus goes when the mobile Sheet closes. */
  returnFocusRef: React.RefObject<HTMLElement | null>;
};

const SidebarContext = React.createContext<SidebarContextProps | null>(null);

function useSidebarContext() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }
  return context;
}

/** Sidebar state and controls, e.g. to close the mobile Sheet after navigating. */
function useSidebar(): Omit<SidebarContextProps, "returnFocusRef"> {
  return useSidebarContext();
}

interface SidebarProviderProps extends React.ComponentProps<"div"> {
  /** Initial desktop state when uncontrolled. Read the `sidebar_state` cookie to restore it. */
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Key that toggles the sidebar with Ctrl/⌘. `false` turns the shortcut off. Default `"b"`. */
  keyboardShortcut?: string | false;
}

/**
 * Wraps the app shell: holds the open state for the Sidebar, its SidebarTrigger and the
 * SidebarInset beside it. The desktop state is saved in the `sidebar_state` cookie.
 */
function SidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  keyboardShortcut = "b",
  className,
  style,
  children,
  ...props
}: SidebarProviderProps) {
  const isMobile = useIsMobile();
  const [openMobile, setOpenMobileState] = React.useState(false);
  const returnFocusRef = React.useRef<HTMLElement | null>(null);
  // The Sheet has no Radix Trigger of its own, so remember what opened it to refocus on close.
  const setOpenMobile = React.useCallback((value: boolean) => {
    if (value && document.activeElement instanceof HTMLElement) {
      returnFocusRef.current = document.activeElement;
    }
    setOpenMobileState(value);
  }, []);

  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const open = openProp ?? internalOpen;
  const setOpen = React.useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const openState = typeof value === "function" ? value(open) : value;
      if (setOpenProp) {
        setOpenProp(openState);
      } else {
        setInternalOpen(openState);
      }
      document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
    },
    [setOpenProp, open],
  );

  const toggleSidebar = React.useCallback(() => {
    if (isMobile) {
      setOpenMobile(!openMobile);
    } else {
      setOpen((value) => !value);
    }
  }, [isMobile, openMobile, setOpen, setOpenMobile]);

  React.useEffect(() => {
    if (!keyboardShortcut) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      // In a text field the same keys mean "bold" or the browser default; leave them alone.
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [contenteditable]:not([contenteditable=false])")) {
        return;
      }
      if (event.key === keyboardShortcut && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [keyboardShortcut, toggleSidebar]);

  const state = open ? "expanded" : "collapsed";

  const contextValue = React.useMemo<SidebarContextProps>(
    () => ({
      state,
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar,
      returnFocusRef,
    }),
    [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar],
  );

  return (
    <SidebarContext.Provider value={contextValue}>
      <TooltipProvider delayDuration={0}>
        <div
          data-slot="sidebar-wrapper"
          style={
            {
              "--sidebar-width": SIDEBAR_WIDTH,
              "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
              ...style,
            } as React.CSSProperties
          }
          className={cn(
            "group/sidebar-wrapper flex min-h-svh w-full has-data-[variant=inset]:bg-muted",
            className,
          )}
          {...props}
        >
          {children}
        </div>
      </TooltipProvider>
    </SidebarContext.Provider>
  );
}

interface SidebarProps extends React.ComponentProps<"div"> {
  side?: "left" | "right";
  /** `sidebar` sits flush against the edge; `floating` and `inset` sit on a muted page. */
  variant?: "sidebar" | "floating" | "inset";
  /** `offcanvas` slides out, `icon` shrinks to its icons (labels move to tooltips), `none` stays. */
  collapsible?: "offcanvas" | "icon" | "none";
  /** Accessible name of the Sheet the sidebar opens in on small screens. Default "Sidebar". */
  label?: string;
}

/**
 * Primary app navigation down one side of the screen. On small screens it opens as a Sheet.
 * Put the links in a `<nav aria-label="…">` inside SidebarContent. For a few top-level
 * sections without a shell, use Tabs instead.
 */
function Sidebar({
  side = "left",
  variant = "sidebar",
  collapsible = "offcanvas",
  label = "Sidebar",
  className,
  children,
  ...props
}: SidebarProps) {
  const { isMobile, state, openMobile, setOpenMobile, returnFocusRef } = useSidebarContext();

  const detached = variant === "floating" || variant === "inset";

  if (collapsible === "none") {
    return (
      <div
        data-slot="sidebar"
        className={cn(
          "flex h-full w-(--sidebar-width) flex-col bg-background text-foreground",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  }

  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile}>
        <SheetContent
          data-sidebar="sidebar"
          data-slot="sidebar"
          data-mobile="true"
          aria-describedby={undefined}
          side={side}
          showCloseButton={false}
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            returnFocusRef.current?.focus();
          }}
          className="w-(--sidebar-width) gap-0 bg-background p-0 text-foreground"
          style={{ "--sidebar-width": SIDEBAR_WIDTH_MOBILE } as React.CSSProperties}
        >
          <SheetHeader className="sr-only">
            <SheetTitle>{label}</SheetTitle>
          </SheetHeader>
          <div className="flex h-full w-full flex-col">{children}</div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div
      className="group peer hidden text-foreground md:block"
      data-state={state}
      data-collapsible={state === "collapsed" ? collapsible : ""}
      data-variant={variant}
      data-side={side}
      data-slot="sidebar"
    >
      <div
        data-slot="sidebar-gap"
        className={cn(
          "relative w-(--sidebar-width) bg-transparent transition-[width] duration-(--duration-slow) ease-standard",
          "group-data-[collapsible=offcanvas]:w-0",
          "group-data-[side=right]:rotate-180",
          detached
            ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]"
            : "group-data-[collapsible=icon]:w-(--sidebar-width-icon)",
        )}
      />
      <div
        data-slot="sidebar-container"
        className={cn(
          "fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) md:flex",
          // Visibility switches at the end of the slide-out, so the off-canvas links leave the
          // tab order and the accessibility tree instead of staying focusable off screen.
          "transition-[left,right,width,visibility] duration-(--duration-slow) ease-standard group-data-[collapsible=offcanvas]:invisible",
          side === "left"
            ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]"
            : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
          detached
            ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]"
            : "border-border group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l",
          className,
        )}
        {...props}
      >
        <div
          data-sidebar="sidebar"
          data-slot="sidebar-inner"
          className={cn(
            "flex h-full w-full flex-col",
            variant === "inset" ? "bg-muted" : "bg-background",
            "group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:border-border",
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

/** The button that collapses and expands the sidebar. Reports its state with `aria-expanded`. */
function SidebarTrigger({
  className,
  onClick,
  "aria-label": ariaLabel = "Toggle sidebar",
  ...props
}: React.ComponentProps<typeof Button>) {
  const { toggleSidebar, open, openMobile, isMobile } = useSidebar();

  return (
    <Button
      data-sidebar="trigger"
      data-slot="sidebar-trigger"
      variant="ghost"
      size="icon"
      aria-label={ariaLabel}
      aria-expanded={isMobile ? openMobile : open}
      className={className}
      onClick={(event) => {
        onClick?.(event);
        toggleSidebar();
      }}
      {...props}
    >
      <PanelLeft aria-hidden />
    </Button>
  );
}

/**
 * A thin strip on the sidebar's edge that toggles it on click. Pointer-only: hidden from
 * assistive tech and the tab order, since SidebarTrigger is the accessible control.
 */
function SidebarRail({ className, ...props }: React.ComponentProps<"button">) {
  const { toggleSidebar } = useSidebar();

  return (
    <button
      data-sidebar="rail"
      data-slot="sidebar-rail"
      aria-hidden
      tabIndex={-1}
      onClick={toggleSidebar}
      title="Toggle sidebar"
      className={cn(
        "absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all duration-(--duration-fast) ease-standard group-data-[side=left]:-right-4 group-data-[side=right]:left-0 after:absolute after:inset-y-0 after:left-1/2 after:w-0.5 hover:after:bg-border sm:flex",
        "in-data-[side=left]:cursor-w-resize in-data-[side=right]:cursor-e-resize",
        "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize",
        "group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full hover:group-data-[collapsible=offcanvas]:bg-muted",
        "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2",
        "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2",
        className,
      )}
      {...props}
    />
  );
}

interface SidebarInsetProps extends React.ComponentProps<"main"> {
  /** Render the child element instead of a <main> (e.g. when the app already has one). */
  asChild?: boolean;
}

/** The page area beside the sidebar. A `<main>` landmark by default. */
function SidebarInset({ className, asChild = false, ...props }: SidebarInsetProps) {
  const Comp = asChild ? Slot.Root : "main";
  return (
    <Comp
      data-slot="sidebar-inset"
      className={cn(
        "relative flex w-full flex-1 flex-col bg-background",
        "md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-lg md:peer-data-[variant=inset]:border md:peer-data-[variant=inset]:border-border md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2",
        className,
      )}
      {...props}
    />
  );
}

function SidebarInput({ className, ...props }: React.ComponentProps<typeof Input>) {
  return (
    <Input
      data-slot="sidebar-input"
      data-sidebar="input"
      size="sm"
      className={cn("w-full bg-background", className)}
      {...props}
    />
  );
}

function SidebarHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-header"
      data-sidebar="header"
      className={cn("flex flex-col gap-2 p-2", className)}
      {...props}
    />
  );
}

function SidebarFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-footer"
      data-sidebar="footer"
      className={cn("flex flex-col gap-2 p-2", className)}
      {...props}
    />
  );
}

function SidebarSeparator({ className, ...props }: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="sidebar-separator"
      data-sidebar="separator"
      className={cn("mx-2 w-auto", className)}
      {...props}
    />
  );
}

/** The scrolling middle of the sidebar, between header and footer. */
function SidebarContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-content"
      data-sidebar="content"
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden",
        className,
      )}
      {...props}
    />
  );
}

function SidebarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-group"
      data-sidebar="group"
      className={cn("relative flex w-full min-w-0 flex-col p-2", className)}
      {...props}
    />
  );
}

function SidebarGroupLabel({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"div"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "div";

  return (
    <Comp
      data-slot="sidebar-group-label"
      data-sidebar="group-label"
      className={cn(
        "flex h-control-sm shrink-0 items-center rounded-md px-2 text-xs font-medium text-muted-foreground",
        "transition-[margin,opacity] duration-(--duration-slow) ease-standard",
        "[&>svg]:size-icon-sm [&>svg]:shrink-0 [&>svg]:stroke-[1.5]",
        focusRing,
        "group-data-[collapsible=icon]:-mt-(--control-sm) group-data-[collapsible=icon]:opacity-0",
        className,
      )}
      {...props}
    />
  );
}

/** An icon button beside a group label, e.g. "Add project". Give it an `aria-label`. */
function SidebarGroupAction({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="sidebar-group-action"
      data-sidebar="group-action"
      className={cn(
        "absolute top-3 right-3 flex size-6 items-center justify-center rounded-md p-0 text-foreground",
        "transition-colors duration-(--duration-fast) ease-standard hover:bg-accent hover:text-accent-foreground",
        "[&>svg]:size-icon-sm [&>svg]:shrink-0 [&>svg]:stroke-[1.5]",
        focusRing,
        // A 24px target is enough with a mouse; widen it for touch.
        "after:absolute after:-inset-2 md:after:hidden",
        "group-data-[collapsible=icon]:hidden",
        className,
      )}
      {...props}
    />
  );
}

function SidebarGroupContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-group-content"
      data-sidebar="group-content"
      className={cn("w-full text-sm", className)}
      {...props}
    />
  );
}

function SidebarMenu({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="sidebar-menu"
      data-sidebar="menu"
      className={cn("flex w-full min-w-0 flex-col gap-1", className)}
      {...props}
    />
  );
}

function SidebarMenuItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="sidebar-menu-item"
      data-sidebar="menu-item"
      className={cn("group/menu-item relative", className)}
      {...props}
    />
  );
}

// The active item gets a bar on its leading edge and a heavier weight, not just a fill,
// so it reads without colour.
const currentPageClasses =
  // On the inset variant the sidebar itself is muted (= accent), so fills switch to background.
  "group-data-[variant=inset]:hover:bg-background group-data-[variant=inset]:aria-[current=page]:bg-background aria-[current=page]:bg-accent aria-[current=page]:font-medium aria-[current=page]:text-accent-foreground before:absolute before:inset-y-1.5 before:left-0 before:w-0.5 before:bg-primary before:opacity-0 aria-[current=page]:before:opacity-100";

const sidebarMenuButtonVariants = cva(
  [
    "peer/menu-button relative flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left",
    "transition-[width,height,padding,background-color] duration-(--duration-fast) ease-standard",
    "hover:bg-accent hover:text-accent-foreground active:bg-accent active:text-accent-foreground",
    "data-[state=open]:hover:bg-accent data-[state=open]:hover:text-accent-foreground",
    "disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50",
    "group-has-data-[sidebar=menu-action]/menu-item:pr-8",
    "group-data-[collapsible=icon]:size-control-md! group-data-[collapsible=icon]:p-2.5!",
    "[&>span:last-child]:truncate [&>svg]:shrink-0 [&>svg]:stroke-[1.5]",
    focusRing,
    currentPageClasses,
  ],
  {
    variants: {
      variant: {
        ghost: "",
        outline: "bg-background inset-ring inset-ring-border",
      },
      size: {
        sm: "h-control-sm text-xs [&>svg]:size-icon-sm",
        md: "h-control-md text-sm [&>svg]:size-icon-sm",
        lg: "h-control-lg text-base [&>svg]:size-icon-lg",
      },
    },
    defaultVariants: { variant: "ghost", size: "md" },
  },
);

interface SidebarMenuButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof sidebarMenuButtonVariants> {
  /** Render the child element instead of a <button> (e.g. a framework <Link>). */
  asChild?: boolean;
  /** Marks the current page: `aria-current="page"`, a leading bar and a heavier weight. */
  isActive?: boolean;
  /** Label shown beside the icon when the sidebar is collapsed to icons. */
  tooltip?: string | React.ComponentProps<typeof TooltipContent>;
}

/** A top-level navigation item. Pass your router's `<Link>` with `asChild`. */
function SidebarMenuButton({
  asChild = false,
  isActive = false,
  variant = "ghost",
  size = "md",
  tooltip,
  className,
  ...props
}: SidebarMenuButtonProps) {
  const Comp = asChild ? Slot.Root : "button";
  const { isMobile, state } = useSidebar();

  const button = (
    <Comp
      data-slot="sidebar-menu-button"
      data-sidebar="menu-button"
      data-size={size}
      data-active={isActive}
      aria-current={isActive ? "page" : undefined}
      className={cn(sidebarMenuButtonVariants({ variant, size }), className)}
      {...props}
    />
  );

  if (!tooltip) {
    return button;
  }

  const tooltipProps = typeof tooltip === "string" ? { children: tooltip } : tooltip;

  // Held closed (not just hidden) while labels are visible: an open tooltip would swallow the
  // first Escape meant for the mobile Sheet.
  const showTooltip = state === "collapsed" && !isMobile;

  return (
    <Tooltip open={showTooltip ? undefined : false}>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent side="right" align="center" {...tooltipProps} />
    </Tooltip>
  );
}

/** An icon button at the end of a menu item (e.g. a "More" menu). Give it an `aria-label`. */
function SidebarMenuAction({
  className,
  asChild = false,
  showOnHover = false,
  ...props
}: React.ComponentProps<"button"> & {
  asChild?: boolean;
  /** Hide until the item is hovered or focused (always shown on touch screens). */
  showOnHover?: boolean;
}) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="sidebar-menu-action"
      data-sidebar="menu-action"
      className={cn(
        "absolute right-1.5 flex size-6 items-center justify-center rounded-md p-0 text-foreground",
        "transition-colors duration-(--duration-fast) ease-standard hover:bg-background hover:text-accent-foreground peer-hover/menu-button:text-accent-foreground",
        "[&>svg]:size-icon-sm [&>svg]:shrink-0 [&>svg]:stroke-[1.5]",
        focusRing,
        "after:absolute after:-inset-2 md:after:hidden",
        "peer-data-[size=sm]/menu-button:top-1",
        "peer-data-[size=md]/menu-button:top-1.5",
        "peer-data-[size=lg]/menu-button:top-2.5",
        "group-data-[collapsible=icon]:hidden",
        showOnHover &&
          "group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 md:opacity-0",
        className,
      )}
      {...props}
    />
  );
}

/** A count at the end of a menu item. Say what it counts in the item's text or `aria-label`. */
function SidebarMenuBadge({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-menu-badge"
      data-sidebar="menu-badge"
      className={cn(
        "pointer-events-none absolute right-1.5 flex h-6 min-w-6 items-center justify-center rounded-sm px-1 text-xs font-medium text-foreground tabular-nums select-none",
        "peer-data-[size=sm]/menu-button:top-1",
        "peer-data-[size=md]/menu-button:top-1.5",
        "peer-data-[size=lg]/menu-button:top-2.5",
        "group-data-[collapsible=icon]:hidden",
        className,
      )}
      {...props}
    />
  );
}

/** Placeholder for a menu item while the menu loads. Mark the menu `aria-busy`. */
function SidebarMenuSkeleton({
  className,
  showIcon = false,
  ...props
}: React.ComponentProps<"div"> & { showIcon?: boolean }) {
  return (
    <div
      data-slot="sidebar-menu-skeleton"
      data-sidebar="menu-skeleton"
      className={cn("flex h-control-md items-center gap-2 rounded-md px-2", className)}
      {...props}
    >
      {showIcon && <Skeleton className="size-icon-sm" data-sidebar="menu-skeleton-icon" />}
      <Skeleton className="h-4 max-w-[70%] flex-1" data-sidebar="menu-skeleton-text" />
    </div>
  );
}

function SidebarMenuSub({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="sidebar-menu-sub"
      data-sidebar="menu-sub"
      className={cn(
        "mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-border px-2.5 py-0.5",
        "group-data-[collapsible=icon]:hidden",
        className,
      )}
      {...props}
    />
  );
}

function SidebarMenuSubItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="sidebar-menu-sub-item"
      data-sidebar="menu-sub-item"
      className={cn("group/menu-sub-item relative", className)}
      {...props}
    />
  );
}

const sidebarMenuSubButtonVariants = cva(
  [
    "relative flex min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-foreground",
    "transition-colors duration-(--duration-fast) ease-standard hover:bg-accent hover:text-accent-foreground active:bg-accent active:text-accent-foreground",
    "aria-disabled:pointer-events-none aria-disabled:opacity-50",
    "[&>span:last-child]:truncate [&>svg]:shrink-0 [&>svg]:stroke-[1.5]",
    focusRing,
    currentPageClasses,
    "group-data-[collapsible=icon]:hidden",
  ],
  {
    variants: {
      size: {
        sm: "h-control-sm text-xs [&>svg]:size-icon-sm",
        md: "h-control-md text-sm [&>svg]:size-icon-sm",
        lg: "h-control-lg text-base [&>svg]:size-icon-lg",
      },
    },
    defaultVariants: { size: "md" },
  },
);

/** A nested navigation item under a SidebarMenuButton. A link by default; `asChild` for a router link. */
function SidebarMenuSubButton({
  asChild = false,
  size = "md",
  isActive = false,
  className,
  ...props
}: React.ComponentProps<"a"> &
  VariantProps<typeof sidebarMenuSubButtonVariants> & {
    asChild?: boolean;
    /** Marks the current page: `aria-current="page"`, a leading bar and a heavier weight. */
    isActive?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "a";

  return (
    <Comp
      data-slot="sidebar-menu-sub-button"
      data-sidebar="menu-sub-button"
      data-size={size}
      data-active={isActive}
      aria-current={isActive ? "page" : undefined}
      className={cn(sidebarMenuSubButtonVariants({ size }), className)}
      {...props}
    />
  );
}

export {
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
  SidebarSeparator,
  SidebarTrigger,
  sidebarMenuButtonVariants,
  useSidebar,
};
