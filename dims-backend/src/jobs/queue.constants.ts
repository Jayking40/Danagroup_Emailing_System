export const QUEUES = {
  MAIL_DELIVERY: "mail-delivery",
  SEARCH_INDEXER: "search-indexer",
  NOTIFICATIONS: "notifications",
  CLEANUP: "cleanup",
} as const;

export const MAIL_DELIVERY_JOBS = {
  DELIVER: "deliver",
} as const;

export const SEARCH_INDEXER_JOBS = {
  INDEX_MESSAGE: "index-message",
  INDEX_USER: "index-user",
  DELETE_MESSAGE: "delete-message",
  DELETE_USER: "delete-user",
} as const;

export const NOTIFICATION_JOBS = {
  DISPATCH: "dispatch",
  ANNOUNCEMENT: "announcement",
} as const;

export const CLEANUP_JOBS = {
  PURGE_TRASH: "purge-trash",
} as const;

export const USER_STATUS = {
  ONLINE: "online",
  OFFLINE: "offline",
} as const;
