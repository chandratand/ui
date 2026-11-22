"use client";

import * as React from "react";
import { Plus } from "lucide-react";

import { Button } from "@/registry/chandratand/ui/button";
import {
  Field,
  FieldControl,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/registry/chandratand/ui/field";
import { Input } from "@/registry/chandratand/ui/input";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/registry/chandratand/ui/sheet";
import { Textarea } from "@/registry/chandratand/ui/textarea";

export type ClientValues = {
  name: string;
  email: string;
  notes: string;
};

type ClientErrors = Partial<Record<keyof ClientValues, string>>;

const emptyClient: ClientValues = { name: "", email: "", notes: "" };

const fieldOrder = ["name", "email", "notes"] as const;

function validate(values: ClientValues): ClientErrors {
  const errors: ClientErrors = {};
  if (!values.name.trim()) errors.name = "Enter the client name.";
  if (!values.email.trim()) errors.email = "Enter the email address.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()))
    errors.email = "Enter a valid email address.";
  return errors;
}

export interface ClientFormSheetProps {
  /** The client to edit. Without it the sheet adds a new client. */
  client?: ClientValues;
  /** Called with the trimmed values once they are valid; the sheet then closes. */
  onSave: (values: ClientValues) => void;
  /** Replaces the default "Add client" / "Edit client" button. One element; it opens the sheet. */
  trigger?: React.ReactElement;
}

/**
 * Add or edit a record in a side Sheet, keeping the list behind it in view. Validates on save
 * with no form library: each error shows and is announced on its Field, focus moves to the
 * first invalid control, and errors update as the user types. Closing returns focus to the
 * trigger. Copy it and change the fields, rules and `onSave` to your own record. For a
 * one- or two-field task use a Dialog; for a long form with sections, a page of its own.
 */
export function ClientFormSheet({ client, onSave, trigger }: ClientFormSheetProps) {
  const [open, setOpen] = React.useState(false);
  const title = client ? "Edit client" : "Add client";

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {trigger ??
          (client ? (
            <Button variant="outline">{title}</Button>
          ) : (
            <Button>
              <Plus aria-hidden />
              {title}
            </Button>
          ))}
      </SheetTrigger>
      <SheetContent>
        {/* Mounted only while open, so every opening starts from `client` with no errors. */}
        <ClientForm
          title={title}
          initial={client ?? emptyClient}
          onSave={(values) => {
            onSave(values);
            setOpen(false);
          }}
        />
      </SheetContent>
    </Sheet>
  );
}

function ClientForm({
  title,
  initial,
  onSave,
}: {
  title: string;
  initial: ClientValues;
  onSave: (values: ClientValues) => void;
}) {
  const [values, setValues] = React.useState(initial);
  // Errors stay hidden until the first save, then follow every keystroke.
  const [submitted, setSubmitted] = React.useState(false);
  const errors: ClientErrors = submitted ? validate(values) : {};

  const handleChange =
    (key: keyof ClientValues) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setValues({ ...values, [key]: event.target.value });

  const fieldProps = (key: keyof ClientValues) => ({
    name: key,
    value: values[key],
    onChange: handleChange(key),
  });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    const found = validate(values);
    const firstInvalid = fieldOrder.find((key) => found[key]);
    if (firstInvalid) {
      const control = event.currentTarget.elements.namedItem(firstInvalid);
      if (control instanceof HTMLElement) control.focus();
      return;
    }
    onSave({
      name: values.name.trim(),
      email: values.email.trim(),
      notes: values.notes.trim(),
    });
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="flex flex-1 flex-col gap-6">
      <SheetHeader>
        <SheetTitle>{title}</SheetTitle>
        <SheetDescription>Clients appear on the invoices you send them.</SheetDescription>
      </SheetHeader>
      <FieldGroup>
        <Field>
          <FieldLabel>Client name</FieldLabel>
          <FieldControl>
            <Input required autoComplete="organization" {...fieldProps("name")} />
          </FieldControl>
          <FieldDescription>As it appears on invoices.</FieldDescription>
          <FieldError>{errors.name}</FieldError>
        </Field>
        <Field>
          <FieldLabel>Email</FieldLabel>
          <FieldControl>
            <Input required type="email" autoComplete="email" {...fieldProps("email")} />
          </FieldControl>
          <FieldDescription>We send invoices to this address.</FieldDescription>
          <FieldError>{errors.email}</FieldError>
        </Field>
        <Field>
          <FieldLabel>Notes (optional)</FieldLabel>
          <FieldControl>
            <Textarea {...fieldProps("notes")} />
          </FieldControl>
        </Field>
      </FieldGroup>
      <SheetFooter>
        <SheetClose asChild>
          <Button type="button" variant="outline">
            Cancel
          </Button>
        </SheetClose>
        <Button type="submit">Save client</Button>
      </SheetFooter>
    </form>
  );
}
