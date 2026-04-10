"use client";

import { useMemo, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Archive, MailCheck, MailOpen, Star, Trash2 } from "lucide-react";
import type { MailFolder } from "@/types/mail.types";
import { useMailStore } from "@/store/mailStore";

type MailFilter = "all" | "unread" | "starred";

interface MailListProps {
  viewMode: MailFolder;
  searchParams?: {
    page?: number;
    filter?: string;
  };
}

interface MailPreview {
  id: string;
  senderName: string;
  senderEmail: string;
  subject: string;
  snippet: string;
  updatedAt: string;
  unread: boolean;
  starred: boolean;
  archived: boolean;
  deleted: boolean;
  folder: MailFolder;
}

const PAGE_SIZE = 6;

const SAMPLE_MAILS: MailPreview[] = [
  {
    id: "mail-1",
    senderName: "Amina Yusuf",
    senderEmail: "amina@danagroup.com",
    subject: "Q2 vendor review deck",
    snippet: "I've attached the updated slides and highlighted the budget changes for Friday's call.",
    updatedAt: "2026-04-10T08:15:00.000Z",
    unread: true,
    starred: true,
    archived: false,
    deleted: false,
    folder: "inbox",
  },
  {
    id: "mail-2",
    senderName: "Operations Desk",
    senderEmail: "ops@danagroup.com",
    subject: "Warehouse downtime notice",
    snippet: "Maintenance starts tonight at 11pm CET. Please avoid scheduling dispatches during the window.",
    updatedAt: "2026-04-09T17:42:00.000Z",
    unread: true,
    starred: false,
    archived: false,
    deleted: false,
    folder: "inbox",
  },
  {
    id: "mail-3",
    senderName: "Femi Adeyemi",
    senderEmail: "femi@danagroup.com",
    subject: "Re: Lagos branch hiring plan",
    snippet: "Looks good from finance. We only need the final headcount split before approval.",
    updatedAt: "2026-04-08T13:20:00.000Z",
    unread: false,
    starred: true,
    archived: false,
    deleted: false,
    folder: "sent",
  },
  {
    id: "mail-4",
    senderName: "Leadership Team",
    senderEmail: "leadership@danagroup.com",
    subject: "Town hall reminders",
    snippet: "Please send any questions ahead of the session so we can group responses by topic.",
    updatedAt: "2026-04-07T09:00:00.000Z",
    unread: false,
    starred: false,
    archived: false,
    deleted: false,
    folder: "drafts",
  },
  {
    id: "mail-5",
    senderName: "IT Support",
    senderEmail: "support@danagroup.com",
    subject: "Password reset completed",
    snippet: "Your account access has been restored. Let us know if you still see any MFA prompts failing.",
    updatedAt: "2026-04-06T07:30:00.000Z",
    unread: false,
    starred: false,
    archived: false,
    deleted: true,
    folder: "trash",
  },
  {
    id: "mail-6",
    senderName: "Board Liaison",
    senderEmail: "board@danagroup.com",
    subject: "Strategy memo follow-up",
    snippet: "Can you tighten the market sizing section and resend before the end of day?",
    updatedAt: "2026-04-05T16:10:00.000Z",
    unread: true,
    starred: true,
    archived: false,
    deleted: false,
    folder: "starred",
  },
  {
    id: "mail-7",
    senderName: "Procurement",
    senderEmail: "procurement@danagroup.com",
    subject: "Contract signature request",
    snippet: "The supplier has signed. We only need your confirmation to kick off onboarding.",
    updatedAt: "2026-04-04T12:05:00.000Z",
    unread: false,
    starred: false,
    archived: true,
    deleted: false,
    folder: "inbox",
  },
  {
    id: "mail-8",
    senderName: "Ngozi Peters",
    senderEmail: "ngozi@danagroup.com",
    subject: "Draft: customer escalation response",
    snippet: "I saved the talking points and timeline, but still need your wording on the refund section.",
    updatedAt: "2026-04-03T14:48:00.000Z",
    unread: false,
    starred: false,
    archived: false,
    deleted: false,
    folder: "drafts",
  },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function MailListSkeleton() {
  return (
    <div className="flex flex-col">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="mail-list-item animate-pulse items-center">
          <div className="h-10 w-10 rounded-full bg-muted" />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="h-4 w-1/3 rounded bg-muted" />
            <div className="h-4 w-2/3 rounded bg-muted" />
          </div>
          <div className="h-4 w-16 rounded bg-muted" />
        </div>
      ))}
    </div>
  );
}

function MailListItem({
  mail,
  isSelected,
  isChecked,
  onSelect,
  onToggleChecked,
}: {
  mail: MailPreview;
  isSelected: boolean;
  isChecked: boolean;
  onSelect: () => void;
  onToggleChecked: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`mail-list-item w-full items-start text-left ${mail.unread ? "unread" : ""} ${
        isSelected ? "selected" : ""
      }`}
    >
      <input
        aria-label={`Select ${mail.subject}`}
        type="checkbox"
        checked={isChecked}
        onChange={onToggleChecked}
        onClick={(event) => event.stopPropagation()}
        className="mt-1 h-4 w-4 rounded border-border"
      />
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-dana-blue text-sm font-semibold text-white">
        {getInitials(mail.senderName)}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-sm font-semibold text-foreground">{mail.senderName}</span>
          {mail.unread ? <span className="h-2 w-2 shrink-0 rounded-full bg-dana-blue" /> : null}
          {mail.starred ? <Star className="h-4 w-4 shrink-0 fill-current text-amber-400" /> : null}
        </div>
        <p className="truncate text-sm text-foreground">{mail.subject}</p>
        <p className="truncate text-xs text-muted-foreground">{mail.snippet}</p>
      </div>
      <div className="shrink-0 text-right">
        <p className="text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(mail.updatedAt), { addSuffix: true })}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">{mail.senderEmail}</p>
      </div>
    </button>
  );
}

function EmptyState({ viewMode, filter }: { viewMode: MailFolder; filter: MailFilter }) {
  const label =
    filter === "all" ? viewMode : `${filter} ${viewMode === "inbox" ? "messages" : viewMode}`;

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
      <MailOpen className="h-10 w-10 text-muted-foreground" />
      <h3 className="mt-4 text-lg font-semibold text-foreground">No {label} found</h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        This folder is clear for now. When new messages arrive, they will show up here.
      </p>
    </div>
  );
}

export default function MailList({ viewMode, searchParams} : MailListProps) {
  
  const { selectedThreadId, setSelectedThread } = useMailStore((state) => ({
    selectedThreadId: state.selectedThreadId,
    setSelectedThread: state.setSelectedThread,
  }));
  const currentPage = Math.max(searchParams?.page ?? 1, 1);
  const initialFilter = (searchParams?.filter ?? "all") as MailFilter;
  const [activeFilter, setActiveFilter] = useState<MailFilter>(
    initialFilter === "unread" || initialFilter === "starred" ? initialFilter : "all",
  );
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isLoading] = useState(false);

  const folderMessages = useMemo(() => {
    return SAMPLE_MAILS.filter((mail) => {
      if (viewMode === "starred") {
        return mail.starred && !mail.deleted;
      }

      if (viewMode === "trash") {
        return mail.deleted || mail.folder === "trash";
      }

      return mail.folder === viewMode;
    });
  }, [viewMode]);

  const filteredMessages = useMemo(() => {
    return folderMessages.filter((mail) => {
      if (activeFilter === "unread") return mail.unread;
      if (activeFilter === "starred") return mail.starred;
      return true;
    });
  }, [activeFilter, folderMessages]);

  const totalPages = Math.max(1, Math.ceil(filteredMessages.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const pageMessages = filteredMessages.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const allVisibleSelected = pageMessages.length > 0 && pageMessages.every((mail) => selectedIds.includes(mail.id));

  const handleToggleSelection = (id: string) => {
    setSelectedIds((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  };

  const handleBulkAction = (action: "read" | "delete" | "archive") => {
    if (action === "read" && selectedIds.includes(selectedThreadId ?? "")) {
      setSelectedThread(selectedThreadId);
    }

    setSelectedIds([]);
  };

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg border border-border bg-background">
      {viewMode === "inbox" ? (
        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          {(["all", "unread", "starred"] as MailFilter[]).map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
                activeFilter === filter
                  ? "bg-dana-blue text-white"
                  : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              {filter[0].toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>
      ) : null}

      {selectedIds.length > 0 ? (
        <div className="flex flex-wrap items-center gap-2 border-b border-border bg-muted/40 px-4 py-3 text-sm">
          <span className="mr-2 text-muted-foreground">
            {selectedIds.length} selected
          </span>
          <button
            type="button"
            onClick={() => handleBulkAction("read")}
            className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-1.5 hover:bg-accent"
          >
            <MailCheck className="h-4 w-4" />
            Mark as read
          </button>
          <button
            type="button"
            onClick={() => handleBulkAction("archive")}
            className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-1.5 hover:bg-accent"
          >
            <Archive className="h-4 w-4" />
            Archive
          </button>
          <button
            type="button"
            onClick={() => handleBulkAction("delete")}
            className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-dana-red hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>
      ) : null}

      <div className="flex items-center justify-between border-b border-border px-4 py-3 text-sm text-muted-foreground">
        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={allVisibleSelected}
            onChange={() =>
              setSelectedIds((current) =>
                allVisibleSelected
                  ? current.filter((id) => !pageMessages.some((mail) => mail.id === id))
                  : Array.from(new Set([...current, ...pageMessages.map((mail) => mail.id)])),
              )
            }
            className="h-4 w-4 rounded border-border"
          />
          Select page
        </label>
        <span>
          Page {safePage} of {totalPages}
        </span>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {isLoading ? <MailListSkeleton /> : null}

        {!isLoading && pageMessages.length === 0 ? <EmptyState viewMode={viewMode} filter={activeFilter} /> : null}

        {!isLoading &&
          pageMessages.map((mail) => (
            <MailListItem
              key={mail.id}
              mail={mail}
              isSelected={selectedThreadId === mail.id}
              isChecked={selectedIds.includes(mail.id)}
              onSelect={() => setSelectedThread(mail.id)}
              onToggleChecked={() => handleToggleSelection(mail.id)}
            />
          ))}
      </div>
    </div>
  );
}
