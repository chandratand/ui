import { CircleAlert, CircleCheck, Info, TriangleAlert } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/registry/chandratand/ui/alert";
import { DocsSection } from "./section";

const code = "font-mono text-sm";

export function AlertDocs() {
  return (
    <>
      <DocsSection title="Variants">
        <p className="text-muted-foreground">
          An inline message about the page or a section of it. Always start with an icon, so the
          status is not colour alone. The title says what happened; the description says what to
          do.
        </p>
        <div className="flex max-w-xl flex-col gap-3">
          <Alert>
            <Info aria-hidden />
            <AlertTitle>New tax rules from 1 January</AlertTitle>
            <AlertDescription>Invoices issued after this date use 12% VAT.</AlertDescription>
          </Alert>
          <Alert variant="info">
            <Info aria-hidden />
            <AlertTitle>Draft</AlertTitle>
            <AlertDescription>This invoice has not been sent yet.</AlertDescription>
          </Alert>
          <Alert variant="success">
            <CircleCheck aria-hidden />
            <AlertTitle>Payment received</AlertTitle>
          </Alert>
          <Alert variant="warning">
            <TriangleAlert aria-hidden />
            <AlertTitle>Due in 3 days</AlertTitle>
          </Alert>
          <Alert variant="destructive">
            <CircleAlert aria-hidden />
            <AlertTitle>Could not send invoice</AlertTitle>
            <AlertDescription>
              The client email address bounced. Check it and try again.
            </AlertDescription>
          </Alert>
        </div>
      </DocsSection>

      <DocsSection title="Announcements">
        <p className="text-muted-foreground">
          Alerts are <code className={code}>role=&quot;status&quot;</code> by default, read out
          politely. <code className={code}>destructive</code> is{" "}
          <code className={code}>role=&quot;alert&quot;</code>, which interrupts: keep it for
          errors that appear after an action, and pass <code className={code}>role</code> to
          override either.
        </p>
      </DocsSection>
    </>
  );
}
