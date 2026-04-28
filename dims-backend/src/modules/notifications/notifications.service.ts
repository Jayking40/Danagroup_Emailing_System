import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Notification, NotificationType } from "./entities/notification.entity";

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepo: Repository<Notification>,
  ) {}

  async create(
    userId: string,
    type: NotificationType,
    title: string,
    body?: string,
    referenceId?: string,
  ): Promise<Notification> {
    const notification = this.notificationRepo.create({
      userId: userId,
      type,
      title,
      body,
      referenceId: referenceId,
    });

    return this.notificationRepo.save(notification);
  }

  async markRead(notificationId: string, userId: string): Promise<void> {
    const notification = await this.notificationRepo.findOne({
      where: {
        id: notificationId,
        userId: userId,
      },
    });

    if (!notification) {
      throw new NotFoundException("Notification not found");
    }

    notification.isRead = true;
    await this.notificationRepo.save(notification);
  }
}
