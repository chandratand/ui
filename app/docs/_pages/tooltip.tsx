import { Copy, Plus, Printer } from "lucide-react";

import { Button } from "@/registry/chandratand/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/registry/chandratand/ui/tooltip";
import { DocsSection } from "./section";

const code = "font-mono text-sm";

export function TooltipDocs() {
  return (
    <>
      <DocsSection title="Usage">
        <p className="text-muted-foreground">
          A short label for an icon-only control, shown on hover after 300ms and on keyboard
          focus. The trigger still needs its own <code className={code}>aria-label</code>:
          touch users never see the tooltip. Never put essential information or links in it; use
          Popover for that. Wrap the app once in <code className={code}>TooltipProvider</code>.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          {[
            { label: "New invoice", icon: Plus },
            { label: "Copy link", icon: Copy },
            { label: "Print", icon: Printer },
          ].map(({ label, icon: Icon }) => (
            <Tooltip key={label}>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" aria-label={label}>
                  <Icon aria-hidden />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{label}</TooltipContent>
            </Tooltip>
          ))}
        </div>
      </DocsSection>

      <DocsSection title="Placement">
        <p className="text-muted-foreground">
          <code className={code}>side</code> on <code className={code}>TooltipContent</code>:{" "}
          <code className={code}>top</code> (default), <code className={code}>right</code>,{" "}
          <code className={code}>bottom</code>, <code className={code}>left</code>. It flips on
          its own when there is no room.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          {(["top", "right", "bottom", "left"] as const).map((side) => (
            <Tooltip key={side}>
              <TooltipTrigger asChild>
                <Button variant="outline">{side}</Button>
              </TooltipTrigger>
              <TooltipContent side={side}>Shown on the {side}</TooltipContent>
            </Tooltip>
          ))}
        </div>
      </DocsSection>
    </>
  );
}
