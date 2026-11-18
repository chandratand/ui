"use client";

import * as React from "react";
import { Slot } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import { CircleAlert } from "lucide-react";

import { cn } from "@/lib/utils";
import { Label } from "@/registry/chandratand/ui/label";

type FieldContextValue = {
  controlId: string;
  descriptionId: string;
  errorId: string;
  describedBy: string | undefined;
  invalid: boolean;
  disabled: boolean;
  setHasDescription: (value: boolean) => void;
  setHasError: (value: boolean) => void;
};

const FieldContext = React.createContext<FieldContextValue | null>(null);

function useFieldState(disabled: boolean): FieldContextValue {
  const id = React.useId();
  const [hasDescription, setHasDescription] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);
  const descriptionId = `${id}-description`;
  const errorId = `${id}-error`;
  const describedBy = [hasDescription && descriptionId, hasError && errorId]
    .filter(Boolean)
    .join(" ");
  return {
    controlId: `${id}-control`,
    descriptionId,
    errorId,
    describedBy: describedBy || undefined,
    invalid: hasError,
    disabled,
    setHasDescription,
    setHasError,
  };
}

// Description and error register themselves so `aria-describedby` only ever points at
// elements that exist.
function useRegister(setter: ((value: boolean) => void) | undefined, active: boolean) {
  React.useLayoutEffect(() => {
    if (!setter || !active) return;
    setter(true);
    return () => setter(false);
  }, [setter, active]);
}

const fieldVariants = cva("group flex w-full gap-2", {
  variants: {
    orientation: {
      vertical: "flex-col",
      horizontal: "flex-row items-start gap-3 [&>[role=checkbox]]:mt-0.5",
    },
  },
  defaultVariants: { orientation: "vertical" },
});

export interface FieldProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof fieldVariants> {
  /** Disables the control and dims its label. */
  disabled?: boolean;
}

/**
 * One form control with its label, hint and error. Wrap the control in `<FieldControl>` and
 * it is labelled by `<FieldLabel>`, described by `<FieldDescription>` and `<FieldError>`, and
 * marked `aria-invalid` while an error shows. Works with any form library or none.
 * For several controls that share one name (checkbox or radio sets) use `<FieldSet>`.
 */
function Field({ className, orientation, disabled = false, ...props }: FieldProps) {
  const field = useFieldState(disabled);
  return (
    <FieldContext.Provider value={field}>
      <div
        role="group"
        data-slot="field"
        data-orientation={orientation ?? "vertical"}
        data-invalid={field.invalid || undefined}
        data-disabled={disabled || undefined}
        className={cn(fieldVariants({ orientation }), className)}
        {...props}
      />
    </FieldContext.Provider>
  );
}

/** The control's visible name, pointed at the `<FieldControl>` of the same Field. */
function FieldLabel({ className, ...props }: React.ComponentProps<typeof Label>) {
  const field = React.useContext(FieldContext);
  return (
    <Label
      data-slot="field-label"
      htmlFor={field?.controlId}
      className={cn("leading-snug", className)}
      {...props}
    />
  );
}

/**
 * Wraps the one control of a Field (Input, Textarea, Select trigger, Checkbox, Switch) and
 * gives it the id, `aria-describedby`, `aria-invalid` and `disabled` that tie it to the
 * Field. Do not set `id` on the control yourself: the label would lose it.
 */
function FieldControl(props: React.ComponentProps<typeof Slot.Root>) {
  const field = React.useContext(FieldContext);
  return (
    <Slot.Root
      id={field?.controlId}
      aria-describedby={field?.describedBy}
      aria-invalid={field?.invalid || undefined}
      // Slot's props are typed for any HTMLElement, which has no `disabled`; the control does.
      {...(field?.disabled ? { disabled: true } : {})}
      {...props}
    />
  );
}

/** Label and hint stacked beside the control in a horizontal Field. */
function FieldContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-content"
      className={cn("flex flex-1 flex-col gap-1.5", className)}
      {...props}
    />
  );
}

/** Hint text for the control or set. Sentence case; one or two short sentences. */
function FieldDescription({ className, ...props }: React.ComponentProps<"p">) {
  const field = React.useContext(FieldContext);
  useRegister(field?.setHasDescription, true);
  return (
    <p
      data-slot="field-description"
      id={field?.descriptionId}
      className={cn("text-sm leading-normal text-muted-foreground", className)}
      {...props}
    />
  );
}

export interface FieldErrorProps extends React.ComponentProps<"div"> {
  /** Errors as form libraries report them (e.g. react-hook-form's `formState.errors.name`). Ignored when `children` is set. */
  errors?: ReadonlyArray<{ message?: string } | undefined>;
}

/**
 * The error message, with an icon so it is not colour alone. Renders nothing without a
 * message, so it can stay in the markup; while it renders, the control is invalid.
 */
function FieldError({ className, children, errors, ...props }: FieldErrorProps) {
  const field = React.useContext(FieldContext);
  const messages = [...new Set(errors?.map((error) => error?.message).filter(Boolean))];
  const content =
    children ??
    (messages.length > 1 ? (
      <ul className="flex list-disc flex-col gap-1 pl-4">
        {messages.map((message) => (
          <li key={message}>{message}</li>
        ))}
      </ul>
    ) : (
      messages[0]
    ));
  const hasContent = content !== undefined && content !== null && content !== "";
  useRegister(field?.setHasError, hasContent);
  if (!hasContent) return null;

  return (
    <div
      role="alert"
      data-slot="field-error"
      id={field?.errorId}
      className={cn("flex items-start gap-1.5 text-sm text-destructive", className)}
      {...props}
    >
      <CircleAlert aria-hidden className="mt-0.5 size-icon-sm shrink-0 stroke-[1.5]" />
      <div className="min-w-0">{content}</div>
    </div>
  );
}

/**
 * A set of controls under one name, e.g. checkboxes or radio buttons. Name it with
 * `<FieldLegend>`; a `<FieldDescription>` or `<FieldError>` directly inside describes the set.
 */
function FieldSet({ className, disabled, ...props }: React.ComponentProps<"fieldset">) {
  const field = useFieldState(!!disabled);
  return (
    <FieldContext.Provider value={field}>
      <fieldset
        data-slot="field-set"
        data-invalid={field.invalid || undefined}
        aria-describedby={field.describedBy}
        disabled={disabled}
        className={cn("flex min-w-0 flex-col gap-3", className)}
        {...props}
      />
    </FieldContext.Provider>
  );
}

const fieldLegendVariants = cva("mb-1 font-medium text-foreground", {
  variants: {
    variant: {
      legend: "text-base",
      label: "text-sm",
    },
  },
  defaultVariants: { variant: "legend" },
});

export interface FieldLegendProps
  extends React.ComponentProps<"legend">,
    VariantProps<typeof fieldLegendVariants> {}

/** The name of a FieldSet. `variant="label"` matches FieldLabel for a set inside a form. */
function FieldLegend({ className, variant, ...props }: FieldLegendProps) {
  return (
    <legend
      data-slot="field-legend"
      className={cn(fieldLegendVariants({ variant }), className)}
      {...props}
    />
  );
}

/** Stacks Fields with the form's vertical rhythm. */
function FieldGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="field-group" className={cn("flex flex-col gap-6", className)} {...props} />
  );
}

export {
  Field,
  FieldContent,
  FieldControl,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  fieldLegendVariants,
  fieldVariants,
};
