"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Forward } from "lucide-react";
import MailMessage from "./MailMessage";
import ComposeModal from "./ComposeModal";
import Spinner from "@/components/ui/Spinner";

// TODO: Implement MailThread Component
// Props: threadId: string
// - Fetches all messages in the thread via GET /api/mail/thread/:threadId
// - Renders all messages chronologically using MailMessage component
// - Shows thread subject as heading
// - Shows participant count and date range
// - Inline reply composer (ComposeModal in reply mode) pinned at bottom
// - Forward action on the last message

interface ThreadData {
  subject: string;
  messages: any[];
  participantCount: number;
  startDate: string;
  endDate: string;
}

export default function MailThread({ threadId }: { threadId: string }) {
  const [data, setData] = useState<ThreadData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchThread() {
      try {
        setLoading(true);
        const response = await fetch(`/api/mail/thread/${threadId}`);
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching thread:", error);
      } finally {
        setLoading(false);
      }
    }

    if (threadId) fetchThread();
  }, [threadId]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!data) return null;

  const lastMessage = data.messages[data.messages.length - 1];

  return (
    <div className="flex h-full flex-col overflow-hidden bg-background">
      {/* Thread Header */}
      <header className="border-b p-6 bg-white shrink-0">
        <h1 className="text-xl font-bold text-foreground mb-2">{data.subject}</h1>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="bg-muted px-2 py-0.5 rounded-full">
              {data.participantCount} participants
            </span>
          </div>
          <span>
            {format(new Date(data.startDate), "MMM d")} - {format(new Date(data.endDate), "MMM d, yyyy")}
          </span>
        </div>
      </header>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col">
          {data.messages.map((msg, index) => (
            <div key={msg.id} className="relative">
              <MailMessage 
                message={msg} 
                isCollapsed={index !== data.messages.length - 1} 
              />
              
              {/* Forward action on the last message */}
              {index === data.messages.length - 1 && (
                <div className="px-11 py-4">
                  <button className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-dana-blue transition-colors">
                    <Forward className="h-4 w-4" />
                    Forward this thread
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Inline reply composer pinned at bottom */}
      <div className="border-t p-4 bg-slate-50/50">
        <div className="max-w-4xl mx-auto">
          <ComposeModal 
            mode="reply" 
            threadId={threadId} 
            parentMessage={lastMessage}
            inline={true} 
          />
        </div>
      </div>
    </div>
  );
}
