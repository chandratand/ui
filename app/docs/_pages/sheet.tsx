import { Button } from "@/registry/chandratand/ui/button";
import { Input } from "@/registry/chandratand/ui/input";
import { Label } from "@/registry/chandratand/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  type SheetContentProps,
} from "@/registry/chandratand/ui/sheet";
import { DocsSection } from "./section";

const sides = ["top", "right", "bottom", "left"] as const;
const sizes = [
  { size: "sm", label: "Small", width: "384px" },
  { size: "md", label: "Medium", width: "448px" },
  { size: "lg", label: "Large", width: "576px" },
] as const;

function ClientForm({ id }: { id: string }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor={`${id}-name`}>Client name</Label>
        <Input id={`${id}-name`} defaultValue="PT Sinar Jaya" />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor={`${id}-email`}>Email</Label>
        <Input id={`${id}-email`} type="email" defaultValue="finance@sinarjaya.co.id" />
      </div>
    </div>
  );
}

function ExampleSheet({
  trigger,
  title,
  side,
  size,
  showCloseButton,
}: {
  trigger: string;
  title: string;
} & Pick<SheetContentProps, "side" | "size" | "showCloseButton">) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">{trigger}</Button>
      </SheetTrigger>
      <SheetContent side={side} size={size} showCloseButton={showCloseButton}>
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>Edit the client and save when you&apos;re done.</SheetDescription>
        </SheetHeader>
        <ClientForm id={trigger.toLowerCase().replace(/\s+/g, "-")} />
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Cancel</Button>
          </SheetClose>
          <SheetClose asChild>
            <Button>Save</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export function SheetDocs() {
  return (
    <>
      <DocsSection title="Sides">
        <p className="text-muted-foreground">
          <code className="font-mono text-sm">right</code> (default) for add/edit forms and
          details, <code className="font-mono text-sm">left</code> for navigation,{" "}
          <code className="font-mono text-sm">top</code> and{" "}
          <code className="font-mono text-sm">bottom</code> for short content that spans the
          screen. Focus stays inside the sheet; Escape closes it and returns focus to the trigger.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          {sides.map((side) => (
            <ExampleSheet
              key={side}
              side={side}
              trigger={`Open ${side} sheet`}
              title={`Sheet from the ${side}`}
            />
          ))}
        </div>
      </DocsSection>

      <DocsSection title="Sizes">
        <p className="text-muted-foreground">
          <code className="font-mono text-sm">size</code> sets the width of left and right sheets
          from the <code className="font-mono text-sm">sm</code> breakpoint up:{" "}
          {sizes.map(({ size, width }, index) => (
            <span key={size}>
              <code className="font-mono text-sm">{size}</code> {width}
              {size === "md" ? " (default)" : ""}
              {index < sizes.length - 1 ? ", " : "."}
            </span>
          ))}{" "}
          Below it, a side sheet takes three quarters of the screen.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          {sizes.map(({ size, label }) => (
            <ExampleSheet
              key={size}
              size={size}
              trigger={`Open ${label.toLowerCase()} sheet`}
              title={`${label} sheet`}
            />
          ))}
        </div>
      </DocsSection>

      <DocsSection title="States">
        <p className="text-muted-foreground">
          The × button is on by default. Turn it off with{" "}
          <code className="font-mono text-sm">showCloseButton=&#123;false&#125;</code> only when
          the footer has its own way out; Escape and the overlay still close the sheet.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <ExampleSheet
            showCloseButton={false}
            trigger="Open sheet without close button"
            title="Sheet without close button"
          />
        </div>
      </DocsSection>
    </>
  );
}
