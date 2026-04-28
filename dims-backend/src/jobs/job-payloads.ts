import { Type } from "class-transformer";
import {
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsIn,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
  ValidateNested,
} from "class-validator";

import { NotificationType } from "@modules/notifications/entities/notification.entity";

export class MailDeliveryJobData {
  @IsUUID()
  messageId: string;
}

export class IndexMessageJobData {
  @IsUUID()
  messageId: string;
}

export class IndexUserJobData {
  @IsUUID()
  userId: string;
}

export class DeleteMessageJobData {
  @IsUUID()
  messageId: string;
}

export class DeleteUserJobData {
  @IsUUID()
  userId: string;
}

export class NotificationEventPayload {
  @IsString()
  event: string;

  @IsObject()
  data: Record<string, unknown>;
}

export class NotificationDispatchJobData {
  @IsUUID()
  userId: string;

  @IsIn(["new_mail", "announcement", "system"])
  type: NotificationType;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  body?: string;

  @IsOptional()
  @IsUUID()
  referenceId?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => NotificationEventPayload)
  eventPayload?: NotificationEventPayload;
}

export class AnnouncementNotificationJobData {
  @IsArray()
  @ArrayMinSize(1)
  @ArrayUnique()
  @IsUUID("all", { each: true })
  userIds: string[];

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  body?: string;

  @IsOptional()
  @IsUUID()
  referenceId?: string;
}

export class CleanupTrashJobData {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(365)
  olderThanDays?: number;
}
