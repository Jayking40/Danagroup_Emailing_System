import { InjectQueue } from "@nestjs/bullmq";
import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { Queue } from "bullmq";
import { CLEANUP_JOBS, QUEUES } from "./queue.constants";

@Injectable()
export class JobsScheduler {
  private readonly logger = new Logger(JobsScheduler.name);

  constructor(
    @InjectQueue(QUEUES.CLEANUP)
    private readonly cleanupQueue: Queue,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async scheduleTrashCleanup() {
    await this.cleanupQueue.add(
      CLEANUP_JOBS.PURGE_TRASH,
      { olderThanDays: 30 },
      {
        attempts: 5,
        backoff: { type: "exponential", delay: 5000 },
        jobId: `${CLEANUP_JOBS.PURGE_TRASH}:daily`,
      },
    );

    this.logger.debug("Scheduled daily trash cleanup job");
  }
}
