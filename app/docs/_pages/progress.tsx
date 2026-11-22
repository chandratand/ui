import { Progress } from "@/registry/chandratand/ui/progress";
import { DocsSection } from "./section";

export function ProgressDocs() {
  return (
    <>
      <DocsSection title="Usage">
        <p className="text-muted-foreground">
          Name the bar with a visible label and{" "}
          <code className="font-mono text-sm">aria-labelledby</code>. Screen readers announce the
          value as a percentage; show it as text too, so the bar is not the only cue.
        </p>
        <div className="flex max-w-md flex-col gap-2">
          <div className="flex items-center justify-between text-sm">
            <span id="progress-upload-label" className="font-medium">
              Uploading invoice.pdf
            </span>
            <span className="text-muted-foreground">60%</span>
          </div>
          <Progress value={60} aria-labelledby="progress-upload-label" />
        </div>
      </DocsSection>

      <DocsSection title="States">
        <p className="text-muted-foreground">
          From empty to complete. Changes in value slide with{" "}
          <code className="font-mono text-sm">--duration-normal</code>, which is 0 under reduced
          motion.
        </p>
        <div className="flex max-w-md flex-col gap-4">
          {[
            { label: "Not started", value: 0 },
            { label: "Step 1 of 4", value: 25 },
            { label: "Complete", value: 100 },
          ].map(({ label, value }) => (
            <div key={label} className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-sm">
                <span>{label}</span>
                <span className="text-muted-foreground">{value}%</span>
              </div>
              <Progress value={value} aria-label={label} />
            </div>
          ))}
        </div>
      </DocsSection>

      <DocsSection title="Custom height">
        <p className="text-muted-foreground">
          Progress is not a control, so it has no <code className="font-mono text-sm">size</code>.
          Override the 8px height with <code className="font-mono text-sm">className</code> when a
          thinner bar fits better, such as inside a table row.
        </p>
        <div className="flex max-w-md flex-col gap-2">
          <Progress value={40} aria-label="Storage used" className="h-1" />
        </div>
      </DocsSection>
    </>
  );
}
