import { Badge } from "@/registry/chandratand/ui/badge";
import { Button } from "@/registry/chandratand/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/chandratand/ui/card";
import { DocsSection } from "./section";

const code = "font-mono text-sm";

export function CardDocs() {
  return (
    <>
      <DocsSection title="Usage">
        <p className="text-muted-foreground">
          A bordered surface that groups one thing: an invoice, a client, a setting. Elevation is
          the border, not a shadow. Compose it from <code className={code}>CardHeader</code>,{" "}
          <code className={code}>CardContent</code> and <code className={code}>CardFooter</code>;
          leave out the parts you don&apos;t need.
        </p>
        <Card className="max-w-sm">
          <CardHeader>
            <CardTitle>Invoice #1042</CardTitle>
            <CardDescription>PT Contoh Jaya · due 30 November</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <span className="font-mono text-2xl tabular-nums">Rp 4.250.000</span>
            <Badge variant="success">Paid</Badge>
          </CardContent>
          <CardFooter>
            <Button size="sm" variant="outline">
              View
            </Button>
            <Button size="sm">Send receipt</Button>
          </CardFooter>
        </Card>
      </DocsSection>

      <DocsSection title="Content only">
        <p className="text-muted-foreground">
          For a stat or a short note, a Card with only <code className={code}>CardContent</code>{" "}
          is enough.
        </p>
        <div className="grid max-w-xl gap-4 sm:grid-cols-2">
          {[
            { label: "Outstanding", value: "Rp 12.400.000" },
            { label: "Paid this month", value: "Rp 31.050.000" },
          ].map(({ label, value }) => (
            <Card key={label}>
              <CardContent className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground">{label}</span>
                <span className="font-mono text-xl tabular-nums">{value}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </DocsSection>
    </>
  );
}
