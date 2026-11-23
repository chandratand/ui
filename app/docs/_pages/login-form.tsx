"use client";

import { useState } from "react";

import { LoginForm } from "@/registry/chandratand/blocks/login-form/components/login-form";
import { DocsSection } from "./section";

const code = "font-mono text-sm";

const usage = `<LoginForm
  className="w-full max-w-sm"
  onSubmit={({ email, password }) => signIn(email, password)}
/>`;

export function LoginFormDocs() {
  const [signedIn, setSignedIn] = useState<string | null>(null);

  return (
    <>
      <DocsSection title="Preview">
        <p className="text-muted-foreground">
          Sign in with an empty or wrong field: the error shows on that field, is announced, and
          focus moves to it. Fill in both fields and sign in again.
        </p>
        <LoginForm className="w-full max-w-sm" onSubmit={({ email }) => setSignedIn(email)} />
        <p role="status" className="text-sm text-muted-foreground">
          {signedIn && `Signed in as ${signedIn}.`}
        </p>
      </DocsSection>

      <DocsSection title="Usage">
        <p className="text-muted-foreground">
          Installs <code className={code}>components/login-form.tsx</code>. Place it on your
          sign-in page, centred, with a width such as <code className={code}>max-w-sm</code>.{" "}
          <code className={code}>onSubmit</code> gets the trimmed email and the password once
          both are valid. Sending them, a pending state that stops a second submit,
          redirecting and a wrong-password message are up to your app. The email field uses{" "}
          <code className={code}>autoComplete=&quot;username&quot;</code> and the password{" "}
          <code className={code}>&quot;current-password&quot;</code>, so browsers and password
          managers fill them. Add links (forgot password, sign up) or sign-in providers straight
          into the copied file.
        </p>
        <pre className="overflow-x-auto rounded-md border border-border bg-muted p-4 font-mono text-sm">
          <code>{usage}</code>
        </pre>
      </DocsSection>
    </>
  );
}
