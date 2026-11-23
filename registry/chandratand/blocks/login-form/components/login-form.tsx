"use client";

import * as React from "react";

import { Button } from "@/registry/chandratand/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/chandratand/ui/card";
import {
  Field,
  FieldControl,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/registry/chandratand/ui/field";
import { Input } from "@/registry/chandratand/ui/input";

export type LoginValues = {
  email: string;
  password: string;
};

type LoginErrors = Partial<Record<keyof LoginValues, string>>;

const fieldOrder = ["email", "password"] as const;

function validate(values: LoginValues): LoginErrors {
  const errors: LoginErrors = {};
  if (!values.email.trim()) errors.email = "Enter your email address.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()))
    errors.email = "Enter a valid email address.";
  if (!values.password) errors.password = "Enter your password.";
  return errors;
}

export interface LoginFormProps extends Omit<React.ComponentProps<typeof Card>, "onSubmit"> {
  /** Called with the trimmed email and the password, as typed, once both are valid. */
  onSubmit: (values: LoginValues) => void;
}

/**
 * Sign-in form in a Card: email and password with the autocomplete hints password managers
 * read. Validates on submit with no form library: each error shows and is announced on its
 * Field, focus moves to the first invalid control, and errors update as the user types.
 * Sending the credentials is left to `onSubmit`. Copy it and add your own links (forgot
 * password, sign up) or providers. For signing up, start from a new form: it needs
 * `autoComplete="new-password"`.
 */
export function LoginForm({ onSubmit, className, ...props }: LoginFormProps) {
  const titleId = React.useId();
  const [values, setValues] = React.useState<LoginValues>({ email: "", password: "" });
  // Errors stay hidden until the first submit, then follow every keystroke.
  const [submitted, setSubmitted] = React.useState(false);
  const errors: LoginErrors = submitted ? validate(values) : {};

  const fieldProps = (key: keyof LoginValues) => ({
    name: key,
    value: values[key],
    onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
      setValues({ ...values, [key]: event.target.value }),
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
    // Passwords may start or end with spaces, so only the email is trimmed.
    onSubmit({ email: values.email.trim(), password: values.password });
  }

  return (
    <Card className={className} {...props}>
      <CardHeader>
        <CardTitle id={titleId}>Sign in</CardTitle>
        <CardDescription>Enter your email and password.</CardDescription>
      </CardHeader>
      <CardContent>
        <form noValidate aria-labelledby={titleId} onSubmit={handleSubmit} className="flex flex-col gap-6">
          <FieldGroup>
            <Field>
              <FieldLabel>Email</FieldLabel>
              <FieldControl>
                {/* "username" rather than "email": it is what password managers pair with a sign-in password. */}
                <Input required type="email" autoComplete="username" {...fieldProps("email")} />
              </FieldControl>
              <FieldError>{errors.email}</FieldError>
            </Field>
            <Field>
              <FieldLabel>Password</FieldLabel>
              <FieldControl>
                <Input
                  required
                  type="password"
                  autoComplete="current-password"
                  {...fieldProps("password")}
                />
              </FieldControl>
              <FieldError>{errors.password}</FieldError>
            </Field>
          </FieldGroup>
          <Button type="submit" className="w-full">
            Sign in
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
