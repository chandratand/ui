"use client";

import * as React from "react";
import { Slot } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import { CircleAlert } from "lucide-react";

import { cn } from "@/lib/utils";
import { Label } from "@/registry/chandratand/ui/label";
import { Separator } from "@/registry/chandratand/ui/separator";

type Register = (id: string) => () => void;

type FieldContextValue = {
  controlId: string | undefined;
  describedBy: string | undefined;
  invalid: boolean;
  disabled: boolean;
  registerControl: Register;
  registerDescription: Register;
  registerError: Register;
};

const FieldContext = React.createContext<FieldContextValue | null>(null);

function useIdList(): [string[], Register] {
  const [ids, setIds] = React.useState<string[]>([]);
  const register = React.useCallback<Register>((id) => {
    setIds((current) => [...current, id]);
    return () => setIds((current) => current.filter((each) => each !== id));
  }, []);
  return [ids, register];
}

function joinIds(...lists: Array<string | undefined>) {
  const ids = new Set(lists.flatMap((list) => list?.split(/\s+/).filter(Boolean) ?? []));
  return ids.size > 0 ? [...ids].join(" ") : undefined;
}

function useFieldState(disabled: boolean, invalid: boolean): FieldContextValue {
  const [controlIds, registerControl] = useIdList();
  const [descriptionIds, registerDescription] = useIdList();
  const [errorIds, registerError] = useIdList();
  return {
    controlId: controlIds[0],
    describedBy: joinIds(...descriptionIds, ...errorIds),
    invalid: invalid || errorIds.length > 0,
    disabled,
    registerControl,
    registerDescription,
    registerError,
  };
}

// Parts register once mounted, so `for` and `aria-describedby` never point at a missing id.
function useRegister(register: Register | undefined, id: string, active = true) {
  React.useLayoutEffect(
    () => (register && active ? register(id) : undefined),
    [register, id, active],
  );
}

function isSet(flag: boolean | "true" | "false" | undefined) {
  return flag === true || flag === "true";
}

const fieldVariants = cva("group flex w-full gap-2", {
  variants: {
    orientation: {
      vertical: "flex-col",
      horizontal: "flex-row items-start gap-3 [&>[role=checkbox]]:mt-0.5",
      responsive:
        "flex-col @md/field-group:flex-row @md/field-group:items-start @md/field-group:gap-3 @md/field-group:*:w-auto @md/field-group:*:data-[slot=field-label]:flex-auto @md/field-group:[&>[role=checkbox]]:mt-0.5",
    },
  },
  defaultVariants: { orientation: "vertical" },
});

export interface FieldProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof fieldVariants> {
  /** Disables the control and dims its label. */
  disabled?: boolean;
  /** Marks the control invalid when the error shows elsewhere. A rendered `FieldError` does this on its own. */
  invalid?: boolean;
  /** shadcn's way to mark a Field invalid; same as `invalid`. */
  "data-invalid"?: boolean | "true" | "false";
}

/**
 * One form control with its label, hint and error. Wrap the control in `<FieldControl>` and
 * it is labelled by `<FieldLabel>`, described by `<FieldDescription>` and `<FieldError>`, and
 * marked `aria-invalid` while an error shows. Works with any form library or none.
 * `orientation="responsive"` stacks inside a narrow `<FieldGroup>` and goes horizontal when it
 * is wide. For several controls that share one name (checkbox or radio sets) use `<FieldSet>`.
 */
function Field({
  className,
  orientation,
  disabled = false,
  invalid = false,
  "data-invalid": dataInvalid,
  ...props
}: FieldProps) {
  const field = useFieldState(disabled, invalid || isSet(dataInvalid));
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

/**
 * The control's visible name. Inside a Field with a `<FieldControl>` it points at that control;
 * otherwise pass `htmlFor` yourself, as in shadcn.
 */
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
 * A title that is not a `<label>`, e.g. the heading of a choice card whose `<FieldLabel>`
 * wraps a whole Field.
 */
function FieldTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-label"
      className={cn(
        "flex w-fit items-center gap-2 text-sm font-medium leading-snug text-foreground",
        "group-data-[disabled=true]:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

type ControlProps = Pick<
  React.HTMLAttributes<HTMLElement>,
  "id" | "aria-describedby" | "aria-invalid"
>;

/**
 * Wraps the one control of a Field (Input, Textarea, Select trigger, Checkbox, Switch) and
 * gives it the id, `aria-describedby`, `aria-invalid` and `disabled` that tie it to the
 * Field. An `id` on the control is kept and used by the label; its own `aria-describedby` is
 * added to the Field's. The label and hint links attach on hydration; `invalid` renders on
 * the server.
 */
function FieldControl({ children, ...props }: React.ComponentProps<typeof Slot.Root>) {
  const field = React.useContext(FieldContext);
  const generatedId = React.useId();
  const child = React.isValidElement<ControlProps>(children) ? children : null;
  const id = child?.props.id ?? props.id ?? generatedId;
  useRegister(field?.registerControl, id);
  const wired: ControlProps = {
    id,
    "aria-describedby": joinIds(
      field?.describedBy,
      props["aria-describedby"],
      child?.props["aria-describedby"],
    ),
    "aria-invalid": child?.props["aria-invalid"] ?? props["aria-invalid"] ?? (field?.invalid || undefined),
  };
  return (
    // Slot's props are typed for any HTMLElement, which has no `disabled`; the control does.
    <Slot.Root {...(field?.disabled ? { disabled: true } : {})} {...props} {...wired}>
      {child ? React.cloneElement(child, wired) : children}
    </Slot.Root>
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
function FieldDescription({ className, id, ...props }: React.ComponentProps<"p">) {
  const field = React.useContext(FieldContext);
  const generatedId = React.useId();
  const descriptionId = id ?? generatedId;
  useRegister(field?.registerDescription, descriptionId);
  return (
    <p
      data-slot="field-description"
      id={descriptionId}
      className={cn("text-sm font-normal leading-normal text-muted-foreground", className)}
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
function FieldError({ className, children, errors, id, ...props }: FieldErrorProps) {
  const field = React.useContext(FieldContext);
  const generatedId = React.useId();
  const errorId = id ?? generatedId;
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
  useRegister(field?.registerError, errorId, hasContent);
  if (!hasContent) return null;

  return (
    <div
      role="alert"
      data-slot="field-error"
      id={errorId}
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
  const field = useFieldState(!!disabled, false);
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

/** Stacks Fields with the form's vertical rhythm; its width drives `orientation="responsive"`. */
function FieldGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-group"
      className={cn("@container/field-group flex w-full flex-col gap-6", className)}
      {...props}
    />
  );
}

/** Divides sections of a FieldGroup, optionally with a short text such as "Or". */
function FieldSeparator({ children, className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-separator"
      data-content={!!children}
      className={cn("relative h-5 text-sm", className)}
      {...props}
    >
      <Separator className="absolute inset-x-0 top-1/2" />
      {children && (
        <span
          data-slot="field-separator-content"
          className="relative mx-auto block w-fit bg-background px-2 text-muted-foreground"
        >
          {children}
        </span>
      )}
    </div>
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
  FieldSeparator,
  FieldSet,
  FieldTitle,
  fieldLegendVariants,
  fieldVariants,
};
