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

export default function Home() {
  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-12 px-6 py-12">
      <header className="flex flex-col gap-4 border-b border-border pb-8">
        <p className="font-mono text-sm text-muted-foreground">chandratand/ui · v0.1</p>
        <h1 className="text-4xl font-semibold md:text-5xl">chandratand design system</h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          Tokens and components shared by the portfolio and the SaaS. Calm, precise, trustworthy.
        </p>
        <ThemeControls />
      </header>

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
          Every Component is styled through these. Install them first with{" "}
          <code className="font-mono text-sm">npx shadcn add chandratand/ui/tokens</code>.
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
