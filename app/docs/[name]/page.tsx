import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ThemeControls } from "@/app/theme-controls";
import { Skeleton } from "@/registry/chandratand/ui/skeleton";
import { findDocsPage, installedComponents, publishedDocsItems } from "../manifest";

type Params = PageProps<"/docs/[name]">["params"];

export function generateStaticParams() {
  return publishedDocsItems.map((item) => ({ name: item.name }));
}

export async function generateMetadata({ params }: PageProps<"/docs/[name]">): Promise<Metadata> {
  const found = findDocsPage((await params).name);
  return found ? { title: `${found.item.title} — chandratand/ui` } : {};
}

// The App Shell is shared by every /docs/<name>, so only URL-independent chrome renders
// outside Suspense; reading `params` there makes client navigation block on the server.
export default function DocsPage({ params }: PageProps<"/docs/[name]">) {
  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-12 px-6 py-12">
      <header className="flex flex-col gap-4 border-b border-border pb-8">
        <Link href="/" className="font-mono text-sm text-muted-foreground hover:text-foreground">
          chandratand/ui
        </Link>
        <ThemeControls />
      </header>
      <Suspense fallback={<ItemDocsFallback />}>
        <ItemDocs params={params} />
      </Suspense>
    </main>
  );
}

async function ItemDocs({ params }: { params: Params }) {
  const found = findDocsPage((await params).name);
  if (!found) notFound();
  const { item, Body } = found;

  return (
    <>
      <section className="flex flex-col gap-4">
        <h1 className="text-4xl font-semibold">{item.title}</h1>
        <p className="max-w-2xl text-lg text-muted-foreground">{item.description}</p>
        <pre className="w-fit rounded-md border border-border bg-muted px-3 py-2 font-mono text-sm">
          <code>npx shadcn add chandratand/ui/{item.name}</code>
        </pre>
      </section>
      {item.type === "registry:block" && <InstalledComponents name={item.name} />}
      <Body />
    </>
  );
}

function InstalledComponents({ name }: { name: string }) {
  const components = installedComponents(name);
  return (
    <section aria-labelledby="installs" className="flex flex-col gap-4">
      <h2 id="installs" className="text-2xl font-semibold">
        Installs
      </h2>
      <p className="text-muted-foreground">
        The command above also installs these Components. The Block is yours to change; the
        Components are re-pulled from chandratand/ui, never edited in the app.
      </p>
      <nav aria-label="Components installed">
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          {components.map((component) => (
            <li key={component.name}>
              <Link
                href={`/docs/${component.name}`}
                className="rounded-sm font-medium underline-offset-4 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                {component.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
}

function ItemDocsFallback() {
  return (
    <div className="flex flex-col gap-4" aria-hidden>
      <Skeleton className="h-10 w-48" />
      <Skeleton className="h-7 w-full max-w-2xl" />
      <Skeleton className="h-9 w-72" />
    </div>
  );
}
