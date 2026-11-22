import { Button } from "@/registry/chandratand/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/registry/chandratand/ui/dialog";
import { Input } from "@/registry/chandratand/ui/input";
import { Label } from "@/registry/chandratand/ui/label";
import { DocsSection } from "./section";

const code = "font-mono text-sm";

export function DialogDocs() {
  return (
    <>
      <DocsSection title="Usage">
        <p className="text-muted-foreground">
          A modal for one focused task, such as a short form. Always give it a{" "}
          <code className={code}>DialogTitle</code>; screen readers announce it on open. Focus
          stays inside the dialog, and Escape, the × or the overlay close it and return focus to
          the trigger. For &ldquo;are you sure?&rdquo;, use Alert Dialog; for a longer form, use
          Sheet.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Edit client</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit client</DialogTitle>
                <DialogDescription>Changes apply to future invoices only.</DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-2">
                <Label htmlFor="dialog-company">Company name</Label>
                <Input id="dialog-company" defaultValue="PT Contoh Jaya" />
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button>Save</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </DocsSection>

      <DocsSection title="Without close button">
        <p className="text-muted-foreground">
          <code className={code}>showCloseButton=&#123;false&#125;</code> hides the ×. Do it only
          when the footer has its own way out; Escape and the overlay still close the dialog.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Show invoice terms</Button>
            </DialogTrigger>
            <DialogContent showCloseButton={false}>
              <DialogHeader>
                <DialogTitle>Invoice terms</DialogTitle>
                <DialogDescription>
                  Payment is due 30 days after the invoice date. Late payments incur a 2% fee
                  per month.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button>Got it</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </DocsSection>
    </>
  );
}
