import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/registry/chandratand/ui/accordion";
import { DocsSection } from "./section";

const faqs = [
  {
    value: "billing",
    question: "Can I change my billing plan?",
    answer: "Yes. Changes apply from the next billing period, and unused days are credited.",
  },
  {
    value: "refunds",
    question: "Do you offer refunds?",
    answer: "Within 14 days of purchase, for any reason. Contact support with your invoice number.",
  },
  {
    value: "export",
    question: "Can I export my data?",
    answer: "Every list can be exported to CSV from its overflow menu.",
  },
];

export function AccordionDocs() {
  return (
    <>
      <DocsSection title="Single">
        <p className="text-muted-foreground">
          <code className="font-mono text-sm">type=&quot;single&quot; collapsible</code> keeps at
          most one section open. Enter or Space toggles a section; the arrow keys, Home and End
          move between headers.
        </p>
        <Accordion type="single" collapsible className="max-w-xl">
          {faqs.map((faq) => (
            <AccordionItem key={faq.value} value={faq.value}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </DocsSection>

      <DocsSection title="Multiple">
        <p className="text-muted-foreground">
          <code className="font-mono text-sm">type=&quot;multiple&quot;</code> lets sections open
          independently. Set <code className="font-mono text-sm">defaultValue</code> to open some
          on load.
        </p>
        <Accordion type="multiple" defaultValue={["notifications"]} className="max-w-xl">
          <AccordionItem value="notifications">
            <AccordionTrigger>Notification settings</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Choose which events send an email and which only appear in the app.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="security">
            <AccordionTrigger>Security settings</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Two-factor authentication, active sessions and API keys.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </DocsSection>

      <DocsSection title="States">
        <p className="text-muted-foreground">
          A disabled section is skipped by the keyboard. Opening and closing animate the height
          with <code className="font-mono text-sm">--duration-normal</code>, which is 0 under
          reduced motion.
        </p>
        <Accordion type="single" collapsible className="max-w-xl">
          <AccordionItem value="plan">
            <AccordionTrigger>Current plan</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Team, billed yearly.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="enterprise" disabled>
            <AccordionTrigger>Enterprise options (contact sales)</AccordionTrigger>
            <AccordionContent>Single sign-on and audit logs.</AccordionContent>
          </AccordionItem>
        </Accordion>
      </DocsSection>
    </>
  );
}
