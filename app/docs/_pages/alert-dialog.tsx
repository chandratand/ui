import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/registry/chandratand/ui/alert-dialog";
import { Button } from "@/registry/chandratand/ui/button";
import { DocsSection } from "./section";

const code = "font-mono text-sm";

export function AlertDialogDocs() {
  return (
    <>
      <DocsSection title="Usage">
        <p className="text-muted-foreground">
          Confirms an action with consequences. Unlike Dialog it has no × and does not close on
          an outside click: people choose Cancel or the action. Focus starts on Cancel. Phrase
          the title as the question and name the action on its button, never just
          &ldquo;OK&rdquo;.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Delete invoice</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete invoice #1042?</AlertDialogTitle>
                <AlertDialogDescription>
                  This removes the invoice and its payment history. It cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction variant="destructive">Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </DocsSection>

      <DocsSection title="Non-destructive">
        <p className="text-muted-foreground">
          <code className={code}>AlertDialogAction</code> is <code className={code}>primary</code>{" "}
          by default. Pass <code className={code}>variant=&quot;destructive&quot;</code> only for
          deletes and other actions that cannot be undone.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline">Send all reminders</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Send 12 payment reminders?</AlertDialogTitle>
                <AlertDialogDescription>
                  Each client with an overdue invoice gets one email now.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction>Send reminders</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </DocsSection>
    </>
  );
}
