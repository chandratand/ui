import { Button } from "@/registry/chandratand/ui/button";
import { Input } from "@/registry/chandratand/ui/input";
import { Label } from "@/registry/chandratand/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/registry/chandratand/ui/popover";
import { DocsSection } from "./section";

const code = "font-mono text-sm";

export function PopoverDocs() {
  return (
    <>
      <DocsSection title="Usage">
        <p className="text-muted-foreground">
          A small panel opened by a click, for extra detail next to what it explains. Unlike
          Tooltip it works on touch and can hold anything. It is not modal: the page behind stays
          usable, and Escape or a click outside closes it.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">What is Net 30?</Button>
            </PopoverTrigger>
            <PopoverContent>
              <PopoverHeader>
                <PopoverTitle>Net 30</PopoverTitle>
                <PopoverDescription>
                  Payment is due 30 days after the invoice date.
                </PopoverDescription>
              </PopoverHeader>
            </PopoverContent>
          </Popover>
        </div>
      </DocsSection>

      <DocsSection title="With a form">
        <p className="text-muted-foreground">
          For a quick filter or a single setting. Focus moves into the panel on open and back to
          the trigger on close. Set <code className={code}>align</code> to keep it lined up with
          its trigger.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">Filter by amount</Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="flex flex-col gap-4">
              <PopoverHeader>
                <PopoverTitle>Amount</PopoverTitle>
                <PopoverDescription>Show invoices within this range.</PopoverDescription>
              </PopoverHeader>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="popover-min">Minimum</Label>
                  <Input id="popover-min" size="sm" inputMode="numeric" defaultValue="0" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="popover-max">Maximum</Label>
                  <Input id="popover-max" size="sm" inputMode="numeric" />
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </DocsSection>
    </>
  );
}
