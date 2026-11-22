import { Separator } from "@/registry/chandratand/ui/separator";
import { DocsSection } from "./section";

const code = "font-mono text-sm";

export function SeparatorDocs() {
  return (
    <>
      <DocsSection title="Horizontal">
        <p className="text-muted-foreground">
          A 1px divider between blocks of content. Reach for spacing first; add a Separator only
          when space alone does not group things clearly.
        </p>
        <div className="flex max-w-sm flex-col gap-3 text-sm">
          <span>Subtotal · Rp 3.828.829</span>
          <Separator />
          <span>VAT 11% · Rp 421.171</span>
        </div>
      </DocsSection>

      <DocsSection title="Vertical">
        <p className="text-muted-foreground">
          <code className={code}>orientation=&quot;vertical&quot;</code> fills the height of a
          flex row.
        </p>
        <div className="flex h-6 items-center gap-3 text-sm">
          <span>Invoices</span>
          <Separator orientation="vertical" />
          <span>Clients</span>
          <Separator orientation="vertical" />
          <span>Reports</span>
        </div>
      </DocsSection>

      <DocsSection title="Semantic">
        <p className="text-muted-foreground">
          Decorative by default, so screen readers skip it. Pass{" "}
          <code className={code}>decorative=&#123;false&#125;</code> when it marks a real break
          between sections; it is then announced as a separator.
        </p>
        <div className="flex max-w-sm flex-col gap-3 text-sm">
          <span>Billing address</span>
          <Separator decorative={false} />
          <span>Shipping address</span>
        </div>
      </DocsSection>
    </>
  );
}
