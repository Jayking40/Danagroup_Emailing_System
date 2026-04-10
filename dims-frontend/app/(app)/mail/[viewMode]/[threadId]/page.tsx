import { Suspense } from "react";
import MailThread from "@/components/mail/MailThread";
import Spinner from "@/components/ui/Spinner";

// TODO: Implement Thread View Page
// - All messages in thread displayed chronologically (MailThread component)
// - Collapsible individual messages
// - Inline reply composer at the bottom
// - Attachment previews with download links
// - Forward button on each message
// - Params: threadId (UUID)

export default async function ThreadPage({
  params,
}: {
  params: { threadId: string };
}) {
  const { threadId } = params;

  return (
    <div className="flex h-full flex-col overflow-hidden bg-background">
      {/* 
        Using Suspense to handle the loading state specifically for the thread content.
        This allows the MailList (sidebar) to remain interactive while the thread loads.
      */}
      <Suspense 
        fallback={
          <div className="flex h-full items-center justify-center">
            <Spinner size="lg" />
          </div>
        }
      >
        <MailThread threadId={threadId} />
      </Suspense>
    </div>
  );
}
