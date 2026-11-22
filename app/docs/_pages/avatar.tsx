import { Avatar, AvatarFallback, AvatarGroup } from "@/registry/chandratand/ui/avatar";
import { DocsSection } from "./section";

const code = "font-mono text-sm";

export function AvatarDocs() {
  return (
    <>
      <DocsSection title="Usage">
        <p className="text-muted-foreground">
          A person&apos;s photo in <code className={code}>AvatarImage</code>, with initials in{" "}
          <code className={code}>AvatarFallback</code> while it loads or when there is none. Give
          the image the person&apos;s name as <code className={code}>alt</code>, unless the name
          is already shown next to it.
        </p>
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>SD</AvatarFallback>
          </Avatar>
          <span className="text-sm">Sari Dewi</span>
        </div>
      </DocsSection>

      <DocsSection title="Sizes">
        <p className="text-muted-foreground">
          Match the control heights: <code className={code}>sm</code> 32px,{" "}
          <code className={code}>md</code> 36px (default), <code className={code}>lg</code> 44px.
        </p>
        <div className="flex items-center gap-4">
          {(["sm", "md", "lg"] as const).map((size) => (
            <Avatar key={size} size={size}>
              <AvatarFallback>CT</AvatarFallback>
            </Avatar>
          ))}
        </div>
      </DocsSection>

      <DocsSection title="Group">
        <p className="text-muted-foreground">
          <code className={code}>AvatarGroup</code> overlaps avatars, for the people on a project
          or an invoice thread.
        </p>
        <AvatarGroup>
          {["AB", "CD", "EF"].map((initials) => (
            <Avatar key={initials}>
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          ))}
        </AvatarGroup>
      </DocsSection>
    </>
  );
}
