"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/registry/chandratand/ui/button";
import {
  Field,
  FieldControl,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/registry/chandratand/ui/field";
import { Input } from "@/registry/chandratand/ui/input";

type ClientValues = { name: string };

/** Docs only: react-hook-form is a devDependency of this repo, never of the `field` item. */
export function FieldReactHookFormExample() {
  const { register, handleSubmit, formState } = useForm<ClientValues>({
    defaultValues: { name: "" },
  });
  const [saved, setSaved] = useState<string | null>(null);

  return (
    <form
      aria-label="New client"
      noValidate
      onSubmit={handleSubmit((values) => setSaved(values.name))}
      className="flex max-w-sm flex-col gap-4"
    >
      <Field>
        <FieldLabel>Client name</FieldLabel>
        <FieldControl>
          <Input {...register("name", { required: "Enter the client name." })} />
        </FieldControl>
        <FieldDescription>As it appears on invoices.</FieldDescription>
        <FieldError errors={[formState.errors.name]} />
      </Field>
      <div className="flex items-center gap-3">
        <Button type="submit">Save client</Button>
        {saved && (
          <p role="status" className="text-sm text-muted-foreground">
            Saved {saved}.
          </p>
        )}
      </div>
    </form>
  );
}

