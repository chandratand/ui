import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ThemeControls } from "@/app/theme-controls";
import { Skeleton } from "@/registry/chandratand/ui/skeleton";
import { findDocsPage, publishedDocsItems } from "../manifest";

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
      <Body />
    </>
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
