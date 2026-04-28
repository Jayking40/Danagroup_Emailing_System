import { InjectQueue } from "@nestjs/bullmq";
import { Injectable } from "@nestjs/common";
import { Queue } from "bullmq";
import {
  AnnouncementNotificationJobData,
  CleanupTrashJobData,
  DeleteMessageJobData,
  DeleteUserJobData,
  IndexMessageJobData,
  IndexUserJobData,
  MailDeliveryJobData,
  NotificationDispatchJobData,
} from "./job-payloads";
import { validateJobPayload } from "./job-validation";
import {
  CLEANUP_JOBS,
  MAIL_DELIVERY_JOBS,
  NOTIFICATION_JOBS,
  QUEUES,
  SEARCH_INDEXER_JOBS,
} from "./queue.constants";

@Injectable()
export class JobsService {
  constructor(
    @InjectQueue(QUEUES.MAIL_DELIVERY)
    private readonly mailQueue: Queue,
    @InjectQueue(QUEUES.SEARCH_INDEXER)
    private readonly searchQueue: Queue,
    @InjectQueue(QUEUES.NOTIFICATIONS)
    private readonly notificationsQueue: Queue,
    @InjectQueue(QUEUES.CLEANUP)
    private readonly cleanupQueue: Queue,
  ) {}

  enqueueMailDelivery(payload: MailDeliveryJobData) {
    const data = validateJobPayload(MailDeliveryJobData, payload);
    return this.mailQueue.add(MAIL_DELIVERY_JOBS.DELIVER, data, {
      attempts: 5,
      backoff: { type: "exponential", delay: 5000 },
    });
  }

  enqueueMessageIndex(payload: IndexMessageJobData) {
    const data = validateJobPayload(IndexMessageJobData, payload);
    return this.searchQueue.add(SEARCH_INDEXER_JOBS.INDEX_MESSAGE, data, {
      attempts: 5,
      backoff: { type: "exponential", delay: 5000 },
    });
  }

  enqueueUserIndex(payload: IndexUserJobData) {
    const data = validateJobPayload(IndexUserJobData, payload);
    return this.searchQueue.add(SEARCH_INDEXER_JOBS.INDEX_USER, data, {
      attempts: 5,
      backoff: { type: "exponential", delay: 5000 },
    });
  }

  enqueueMessageDelete(payload: DeleteMessageJobData) {
    const data = validateJobPayload(DeleteMessageJobData, payload);
    return this.searchQueue.add(SEARCH_INDEXER_JOBS.DELETE_MESSAGE, data, {
      attempts: 5,
      backoff: { type: "exponential", delay: 5000 },
    });
  }

  enqueueUserDelete(payload: DeleteUserJobData) {
    const data = validateJobPayload(DeleteUserJobData, payload);
    return this.searchQueue.add(SEARCH_INDEXER_JOBS.DELETE_USER, data, {
      attempts: 5,
      backoff: { type: "exponential", delay: 5000 },
    });
  }

  enqueueNotification(payload: NotificationDispatchJobData) {
    const data = validateJobPayload(NotificationDispatchJobData, payload);
    return this.notificationsQueue.add(NOTIFICATION_JOBS.DISPATCH, data, {
      attempts: 5,
      backoff: { type: "exponential", delay: 5000 },
    });
  }

  enqueueAnnouncement(payload: AnnouncementNotificationJobData) {
    const data = validateJobPayload(AnnouncementNotificationJobData, payload);
    return this.notificationsQueue.add(NOTIFICATION_JOBS.ANNOUNCEMENT, data, {
      attempts: 5,
      backoff: { type: "exponential", delay: 5000 },
    });
  }

  enqueueTrashCleanup(payload: CleanupTrashJobData = {}) {
    const data = validateJobPayload(CleanupTrashJobData, payload);
    return this.cleanupQueue.add(CLEANUP_JOBS.PURGE_TRASH, data, {
      attempts: 5,
      backoff: { type: "exponential", delay: 5000 },
    });
  }

  async getQueueStats() {
    const [mail, search, notifications, cleanup] = await Promise.all([
      this.mailQueue.getJobCounts(),
      this.searchQueue.getJobCounts(),
      this.notificationsQueue.getJobCounts(),
      this.cleanupQueue.getJobCounts(),
    ]);

    return {
      [QUEUES.MAIL_DELIVERY]: mail,
      [QUEUES.SEARCH_INDEXER]: search,
      [QUEUES.NOTIFICATIONS]: notifications,
      [QUEUES.CLEANUP]: cleanup,
    };
  }
}
