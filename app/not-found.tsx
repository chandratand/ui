import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-4 px-6 py-12">
      <h1 className="text-4xl font-semibold">Page not found</h1>
      <p className="text-muted-foreground">
        Nothing lives at this address. The item may not have a docs page yet.{" "}
        <Link href="/" className="text-link underline underline-offset-4">
          Back to the docs home
        </Link>
      </p>
    </main>
  );
}
