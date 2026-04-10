import { MailOpen } from "lucide-react";

export default function MailEmptyPage() {
  return (
    <div className="flex h-full flex-col items-center justify-center text-muted-foreground">
      <MailOpen className="h-12 w-12 opacity-20" />
      <p className="mt-4 text-sm font-medium">Select a thread to read</p>
    </div>
  );
}
