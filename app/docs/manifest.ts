import registry from "@/registry.json";

import { docsPages } from "./_pages";

const documentedTypes = new Set(["registry:ui", "registry:block"]);

/** Components and Blocks in the registry manifest: each one gets a docs page. */
const docsItems = registry.items.filter((item) => documentedTypes.has(item.type));

/** Items whose docs page exists, i.e. the routes under `/docs/<name>`. */
export const publishedDocsItems = docsItems.filter((item) => item.name in docsPages);

const ownPrefix = "chandratand/ui/";

/**
 * Every chandratand/ui Component `shadcn add <name>` installs, by title: the item's
 * `registryDependencies` and theirs in turn (Field brings Label and Separator).
 */
export function installedComponents(name: string) {
  const found = new Map<string, (typeof registry.items)[number]>();
  const visit = (itemName: string) => {
    const item = registry.items.find((candidate) => candidate.name === itemName);
    for (const dep of item?.registryDependencies ?? []) {
      const depName = dep.startsWith(ownPrefix) ? dep.slice(ownPrefix.length) : null;
      const component = registry.items.find((candidate) => candidate.name === depName);
      if (!component || found.has(component.name)) continue;
      found.set(component.name, component);
      visit(component.name);
    }
  };
  visit(name);
  return [...found.values()].sort((a, b) => a.title.localeCompare(b.title));
}

/** The item and its page body for `/docs/<name>`, or null when either is missing. */
export function findDocsPage(name: string) {
  const item = docsItems.find((candidate) => candidate.name === name);
  const Body = docsPages[name];
  return item && Body ? { item, Body } : null;
}
