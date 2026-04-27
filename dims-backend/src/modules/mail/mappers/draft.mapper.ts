import { Message } from "../entities/message.entity";
import { MailMapper } from "./mail.mapper";

export class DraftMapper {
  static toResponse(messages: Message[], currentUserId: string) {
    return messages.map((message) => ({
      ...MailMapper.toMessage(message, currentUserId),
      labels: ["DRAFT"],
    }));
  }
}
