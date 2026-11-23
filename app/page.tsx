import Link from "next/link";

import { publishedDocsItems } from "./docs/manifest";
import { ThemeControls } from "./theme-controls";

const brandSteps = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"];
const chartTokens = ["chart-1", "chart-2", "chart-3", "chart-4", "chart-5"];

const indexGroups = [
  { type: "registry:ui", title: "Components" },
  { type: "registry:block", title: "Blocks" },
] as const;

const byTitle = [...publishedDocsItems].sort((a, b) => a.title.localeCompare(b.title));

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id} className="flex flex-col gap-6">
      <h2 id={id} className="text-2xl font-semibold">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Command({ children }: { children: string }) {
  return (
    <pre className="w-fit rounded-md border border-border bg-muted px-3 py-2 font-mono text-sm">
      <code>{children}</code>
    </pre>
  );
}

export default function Home() {
  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-12 px-6 py-12">
      <header className="flex flex-col gap-4 border-b border-border pb-8">
        <p className="font-mono text-sm text-muted-foreground">chandratand/ui · v0.1</p>
        <h1 className="text-4xl font-semibold md:text-5xl">chandratand design system</h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          Tokens and components shared by the portfolio and the SaaS. Calm, precise, trustworthy.
        </p>
        <p className="max-w-2xl text-muted-foreground">
          A <a
            href="https://ui.shadcn.com/docs/registry"
            className="rounded-sm text-foreground underline underline-offset-4 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            shadcn registry
          </a>
          , not an npm package: the shadcn CLI copies each item&apos;s source into your app. Built on shadcn/ui, Radix and Tailwind CSS v4, adjusted to
          the chandratand tokens and accessibility rules (WCAG 2.2 AA). Install below.
        </p>
        <ThemeControls />
      </header>

      <Section id="style" title="Style">
        <p className="max-w-2xl text-muted-foreground">
          Start a Consumer app with one command: it installs the Tokens and every Component.
        </p>
        <Command>npx shadcn init chandratand/ui/style</Command>
        <p className="max-w-2xl text-muted-foreground">
          Or start with the Tokens only and add Components as you need them:
        </p>
        <Command>
          {"npx shadcn init chandratand/ui/tokens\nnpx shadcn add chandratand/ui/button"}
        </Command>
        <p className="max-w-2xl text-muted-foreground">
          Use <code className="font-mono text-sm">init</code> with one of these instead of a plain{" "}
          <code className="font-mono text-sm">shadcn init</code>: the Components are built on Radix,
          and a plain init now sets the app up for Base UI, which makes the CLI rewrite them into
          code that does not compile.
        </p>
        <p className="max-w-2xl text-muted-foreground">
          Already a shadcn app? If <code className="font-mono text-sm">style</code> in{" "}
          <code className="font-mono text-sm">components.json</code> starts with{" "}
          <code className="font-mono text-sm">base-</code>, change it to{" "}
          <code className="font-mono text-sm">&quot;style&quot;: &quot;new-york&quot;</code> first.
          Then add with <code className="font-mono text-sm">--overwrite</code>, so our Components
          replace shadcn&apos;s files of the same name, and swap any Base UI{" "}
          <code className="font-mono text-sm">render</code> props in your own code for{" "}
          <code className="font-mono text-sm">asChild</code>:
        </p>
        <Command>npx shadcn add chandratand/ui/style --overwrite</Command>
        <p className="max-w-2xl text-muted-foreground">
          Blocks are not included: the app owns and edits a Block after install, so add each one on
          its own from its docs page, e.g.{" "}
          <code className="font-mono text-sm">npx shadcn add chandratand/ui/login-form</code>.
        </p>
      </Section>

      {indexGroups.map(({ type, title }) => {
        const items = byTitle.filter((item) => item.type === type);
        if (items.length === 0) return null;
        const id = title.toLowerCase();
        return (
          <Section key={type} id={id} title={title}>
            <nav aria-labelledby={id}>
              <ul className="grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => (
                  <li key={item.name} className="flex flex-col gap-1">
                    <Link
                      href={`/docs/${item.name}`}
                      className="w-fit rounded-sm font-medium underline-offset-4 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    >
                      {item.title}
                    </Link>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </li>
                ))}
              </ul>
            </nav>
          </Section>
        );
      })}

      <Section id="tokens" title="Tokens">
        <p className="max-w-2xl text-muted-foreground">
          Every Component is styled through these. The Style installs them, or install them alone
          with <code className="font-mono text-sm">npx shadcn init chandratand/ui/tokens</code>.
        </p>
        <div className="flex flex-col gap-3">
          <h3 className="text-lg font-semibold">Brand ramp</h3>
          <div className="grid grid-cols-11 overflow-hidden rounded-lg border border-border">
            {brandSteps.map((step) => (
              <div key={step} className="flex flex-col">
                <div className="h-14" style={{ background: `var(--brand-${step})` }} />
                <span className="py-1 text-center font-mono text-xs text-muted-foreground">
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <h3 className="text-lg font-semibold">Chart palette</h3>
          <div className="flex flex-wrap gap-2">
            {chartTokens.map((token) => (
              <div key={token} className="flex flex-col items-center gap-1">
                <div className="size-12 rounded-md" style={{ background: `var(--${token})` }} />
                <span className="font-mono text-xs text-muted-foreground">{token}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>
    </main>
  );
}
