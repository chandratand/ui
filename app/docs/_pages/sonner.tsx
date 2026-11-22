"use client";

import { Button } from "@/registry/chandratand/ui/button";
import { toast } from "@/registry/chandratand/ui/sonner";
import { DocsSection } from "./section";

const code = "font-mono text-sm";

export function SonnerDocs() {
  return (
    <>
      <DocsSection title="Usage">
        <p className="text-muted-foreground">
          A brief confirmation that something happened, out of the way of the work. Mount{" "}
          <code className={code}>&lt;Toaster /&gt;</code> once near the root, then call{" "}
          <code className={code}>toast()</code> from anywhere. Toasts disappear on their own, so
          never use one for something people must act on; use Alert or Dialog.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" onClick={() => toast("Draft saved")}>
            Save draft
          </Button>
        </div>
      </DocsSection>

      <DocsSection title="Types">
        <p className="text-muted-foreground">
          <code className={code}>toast.success</code>, <code className={code}>.info</code>,{" "}
          <code className={code}>.warning</code> and <code className={code}>.error</code> each
          get their own icon, so the status is not colour alone.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" onClick={() => toast.success("Payment received")}>
            Success
          </Button>
          <Button variant="outline" onClick={() => toast.info("Invoice viewed by client")}>
            Info
          </Button>
          <Button variant="outline" onClick={() => toast.warning("Invoice due in 3 days")}>
            Warning
          </Button>
          <Button variant="outline" onClick={() => toast.error("Could not send invoice")}>
            Error
          </Button>
        </div>
      </DocsSection>

      <DocsSection title="Description and action">
        <p className="text-muted-foreground">
          Add a <code className={code}>description</code> for detail and an{" "}
          <code className={code}>action</code> for one follow-up, such as Undo.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            onClick={() =>
              toast.warning("Invoice due in 3 days", {
                description: "PT Contoh Jaya · Rp 4.250.000",
                action: { label: "Remind", onClick: () => toast.success("Reminder sent") },
              })
            }
          >
            Show with action
          </Button>
        </div>
      </DocsSection>
    </>
  );
}
