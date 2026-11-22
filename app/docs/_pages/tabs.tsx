import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/chandratand/ui/tabs";
import { DocsSection } from "./section";

const code = "font-mono text-sm";
const panel = "text-sm text-muted-foreground";

export function TabsDocs() {
  return (
    <>
      <DocsSection title="Segmented">
        <p className="text-muted-foreground">
          The default: switch between views of the same thing, such as filters on one list.
          Arrow keys move between tabs.
        </p>
        <Tabs defaultValue="all">
          <TabsList aria-label="Invoice filter">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="open">Open</TabsTrigger>
            <TabsTrigger value="paid">Paid</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className={panel}>
            24 invoices.
          </TabsContent>
          <TabsContent value="open" className={panel}>
            12 open invoices.
          </TabsContent>
          <TabsContent value="paid" className={panel}>
            12 paid invoices.
          </TabsContent>
        </Tabs>
      </DocsSection>

      <DocsSection title="Line">
        <p className="text-muted-foreground">
          <code className={code}>variant=&quot;line&quot;</code> on{" "}
          <code className={code}>TabsList</code>, for the sections of a page.
        </p>
        <Tabs defaultValue="activity">
          <TabsList variant="line" aria-label="Client sections">
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>
          <TabsContent value="activity" className={panel}>
            Invoice #1042 sent on 18 November.
          </TabsContent>
          <TabsContent value="payments" className={panel}>
            2 payments.
          </TabsContent>
          <TabsContent value="notes" className={panel}>
            No notes.
          </TabsContent>
        </Tabs>
      </DocsSection>

      <DocsSection title="Vertical">
        <p className="text-muted-foreground">
          <code className={code}>orientation=&quot;vertical&quot;</code> on{" "}
          <code className={code}>Tabs</code> stacks the list beside the content, for settings
          pages. Up and down arrows move between tabs.
        </p>
        <Tabs defaultValue="profile" orientation="vertical">
          <TabsList variant="line" aria-label="Settings">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
          </TabsList>
          <TabsContent value="profile" className={panel}>
            Company name, address and logo.
          </TabsContent>
          <TabsContent value="billing" className={panel}>
            Plan and payment method.
          </TabsContent>
          <TabsContent value="team" className={panel}>
            3 members.
          </TabsContent>
        </Tabs>
      </DocsSection>
    </>
  );
}
