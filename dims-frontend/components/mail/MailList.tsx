"use client";

import { useMemo } from "react";
import { formatDistanceToNow } from "date-fns";
import { Archive, MailOpen, Trash2, Loader2 } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { useMail } from "@/hooks/useMail"; // Path to your hook
import { useMailStore } from "@/store/mailStore"; // Path to your store
import type { MailFolder, Message } from "@/types/mail.types";

type MailFilter = "all" | "unread" | "starred";

interface MailListProps {
  viewMode: MailFolder;
  searchParams?: {
    page?: number;
    filter?: string;
  };
}

export default function MailList({ viewMode, searchParams }: MailListProps) {
  const router = useRouter();
  const params = useParams();
  const currentThreadId = params.threadId as string;

  const page = searchParams?.page || 1;
  // 1. Get Global UI State from Zustand
  const { 
    selectedMessageIds, 
    toggleMessageSelection, 
    resetSelection 
  } = useMailStore();

  // 2. Get Data & Mutations from your Hook
  const mailApi = useMail();
  const folderHooks = {
    inbox: mailApi.useInbox,
    sent: mailApi.useSent,
    drafts: mailApi.useDrafts,
    trash: mailApi.useTrash,
  };
  
  // Fetch real data (Page 1 for now)
  const { data, isLoading } = folderHooks[viewMode as keyof typeof folderHooks](page);
  const deleteMail = mailApi.useDeleteMail(""); // We'll pass IDs dynamically

  // 3. Filtering Logic
  const threads = useMemo(() => {
  // Check if data.data exists (the array), otherwise check if data is the array
  if (Array.isArray(data)) return data;
    if (Array.isArray((data as any)?.data)) return (data as any).data;
    return [];
  }, [data]);
  
  const toggleSelectAll = () => {
    if (selectedMessageIds.length === threads.length) {
      resetSelection();
    } else {
      threads.forEach((t: any) => {
        if (!selectedMessageIds.includes(t.id)) toggleMessageSelection(t.id);
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-hidden bg-white">
      {/* Header & Bulk Actions */}
      <div className="flex flex-col border-b p-4 gap-4 bg-white shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-border"
              checked={threads.length > 0 && selectedMessageIds.length === threads.length}
              onChange={toggleSelectAll}
            />
            {selectedMessageIds.length > 0 ? (
               <div className="flex items-center gap-2 animate-in slide-in-from-left-2">
                 <span className="text-xs font-bold mr-1">{selectedMessageIds.length}</span>
                 <button className="p-1.5 hover:bg-slate-100 rounded text-destructive" 
                   onClick={() => {
                     // Example: Delete first selected (or map to bulk delete if available)
                     selectedMessageIds.forEach(id => deleteMail.mutate());
                     resetSelection();
                   }}>
                   <Trash2 className="h-4 w-4" />
                 </button>
               </div>
            ) : (
              <h2 className="text-sm font-bold capitalize text-foreground">{viewMode}</h2>
            )}
          </div>
        </div>
      </div>

      {/* List Area */}
      <div className="flex-1 overflow-y-auto bg-green-400">
        {threads.length > 0 ? (
          threads.map((message:Message) => (
            <button
              key={message.id} // Keep message.id as the React key
              onClick={() => {
                // Use threadId if available, fallback to id
                const idToUse = message.threadId || message.id; 

                if (idToUse) {
                  router.push(`/mail/${viewMode}/${idToUse}`);
                } else {
                  console.error("No ID found for message:", message);
                }
              }}
              className={`mail-list-item w-full flex items-start text-left p-4 border-b hover:bg-slate-50 transition-colors ${
                //needs change
                message.thread ? "bg-slate-50/50 border-l-4 border-l-dana-blue" : ""
              } ${currentThreadId === message.threadId ? "bg-slate-100" : ""}`}
            >
              <div className="flex items-center gap-3 pr-2">
                <input
                  type="checkbox"
                  checked={selectedMessageIds.includes(message.threadId)}
                  onChange={() => toggleMessageSelection(message.threadId)}
                  onClick={(e) => e.stopPropagation()}
                  className="h-4 w-4 rounded"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="truncate text-sm font-semibold">{message.sender?.firstName} {message.sender?.lastName}</span>
                  <span className="text-[10px] text-muted-foreground">
                    {message.createdAt ? (
                      formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })
                    ) : (
                      "No date"
                    )}
                   </span>
                </div>
                <p className="truncate text-sm font-medium">{message.subject}</p>
                <p className="truncate text-xs text-muted-foreground">{message.bodyHtml || message.body}</p>
              </div>
            </button>
          ))
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center py-16 text-center">
      <MailOpen className="h-10 w-10 text-muted-foreground opacity-20" />
      <h3 className="mt-4 text-sm font-semibold">No messages found</h3>
    </div>
  );
}
