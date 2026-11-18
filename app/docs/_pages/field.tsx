import { Checkbox } from "@/registry/chandratand/ui/checkbox";
import {
  Field,
  FieldContent,
  FieldControl,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/registry/chandratand/ui/field";
import { Input } from "@/registry/chandratand/ui/input";
import { Switch } from "@/registry/chandratand/ui/switch";
import { Textarea } from "@/registry/chandratand/ui/textarea";
import { FieldReactHookFormExample } from "./field-react-hook-form";
import { DocsSection } from "./section";

const code = "font-mono text-sm";

const reactHookFormSource = `const { register, handleSubmit, formState } = useForm({
  defaultValues: { name: "" },
});

<form onSubmit={handleSubmit(save)} noValidate>
  <Field>
    <FieldLabel>Client name</FieldLabel>
    <FieldControl>
      <Input {...register("name", { required: "Enter the client name." })} />
    </FieldControl>
    <FieldDescription>As it appears on invoices.</FieldDescription>
    <FieldError errors={[formState.errors.name]} />
  </Field>
  <Button type="submit">Save client</Button>
</form>`;

export function FieldDocs() {
  return (
    <>
      <DocsSection title="Usage">
        <p className="text-muted-foreground">
          Wrap the control in <code className={code}>FieldControl</code>. The label, hint and
          error find it on their own: no ids, no <code className={code}>aria-describedby</code>{" "}
          by hand.
        </p>
        <div className="flex max-w-sm flex-col gap-6">
          <Field>
            <FieldLabel>Work email</FieldLabel>
            <FieldControl>
              <Input type="email" autoComplete="email" />
            </FieldControl>
            <FieldDescription>We send invoices to this address.</FieldDescription>
          </Field>
          <Field>
            <FieldLabel>Notes (optional)</FieldLabel>
            <FieldControl>
              <Textarea />
            </FieldControl>
          </Field>
        </div>
      </DocsSection>

      <DocsSection title="Orientation">
        <p className="text-muted-foreground">
          <code className={code}>vertical</code> (default) stacks label, control and hint.{" "}
          <code className={code}>horizontal</code> puts a checkbox or switch beside its label;
          group the label and hint in <code className={code}>FieldContent</code>.
        </p>
        <div className="flex max-w-sm flex-col gap-6">
          <Field orientation="horizontal">
            <FieldControl>
              <Checkbox />
            </FieldControl>
            <FieldContent>
              <FieldLabel>Send a copy to me</FieldLabel>
              <FieldDescription>A PDF of every invoice you send.</FieldDescription>
            </FieldContent>
          </Field>
          <Field orientation="horizontal">
            <FieldContent>
              <FieldLabel>Auto-reminders</FieldLabel>
              <FieldDescription>Email the client when an invoice is overdue.</FieldDescription>
            </FieldContent>
            <FieldControl>
              <Switch defaultChecked />
            </FieldControl>
          </Field>
        </div>
      </DocsSection>

      <DocsSection title="Sizes">
        <p className="text-muted-foreground">
          Field has no size of its own: set <code className={code}>size</code> on the control.
        </p>
        <div className="flex max-w-sm flex-col gap-6">
          {(["sm", "md", "lg"] as const).map((size) => (
            <Field key={size}>
              <FieldLabel>Invoice number ({size})</FieldLabel>
              <FieldControl>
                <Input size={size} placeholder="INV-0042" />
              </FieldControl>
            </Field>
          ))}
        </div>
      </DocsSection>

      <DocsSection title="States">
        <p className="text-muted-foreground">
          While <code className={code}>FieldError</code> has a message, the control is{" "}
          <code className={code}>aria-invalid</code> and described by it. The message carries
          an icon, so the error is not colour alone. <code className={code}>disabled</code> on
          Field disables the control and dims the label and hint.
        </p>
        <div className="flex max-w-sm flex-col gap-6">
          <Field>
            <FieldLabel>Username</FieldLabel>
            <FieldControl>
              <Input defaultValue="chandra" />
            </FieldControl>
            <FieldDescription>Letters and numbers only.</FieldDescription>
            <FieldError>Username is already taken.</FieldError>
          </Field>
          <Field disabled>
            <FieldLabel>Client ID</FieldLabel>
            <FieldControl>
              <Input defaultValue="CL-0193" />
            </FieldControl>
            <FieldDescription>Assigned when the client is created.</FieldDescription>
          </Field>
        </div>
      </DocsSection>

      <DocsSection title="Groups">
        <p className="text-muted-foreground">
          <code className={code}>FieldSet</code> with a <code className={code}>FieldLegend</code>{" "}
          names a set of controls; its own hint and error describe the whole set.{" "}
          <code className={code}>FieldGroup</code> spaces the Fields inside.
        </p>
        <FieldSet className="max-w-sm">
          <FieldLegend variant="label">Invoice reminders</FieldLegend>
          <FieldDescription>Sent to the client by email.</FieldDescription>
          <FieldGroup className="gap-3">
            {["7 days before due", "3 days before due", "On the due date"].map((label) => (
              <Field key={label} orientation="horizontal">
                <FieldControl>
                  <Checkbox />
                </FieldControl>
                <FieldLabel className="font-normal">{label}</FieldLabel>
              </Field>
            ))}
          </FieldGroup>
          <FieldError>Choose at least one reminder.</FieldError>
        </FieldSet>
      </DocsSection>

      <DocsSection title="React Hook Form">
        <p className="text-muted-foreground">
          Field depends on no form library. With react-hook-form, spread{" "}
          <code className={code}>register</code> onto the control and pass the field&apos;s
          error to <code className={code}>FieldError</code>. Submit empty to see the error; it
          clears as you type. This example is docs only: the registry item does not ship
          react-hook-form.
        </p>
        <FieldReactHookFormExample />
        <pre className="overflow-x-auto rounded-md border border-border bg-muted p-4 font-mono text-sm">
          <code>{reactHookFormSource}</code>
        </pre>
      </DocsSection>
    </>
  );
}
