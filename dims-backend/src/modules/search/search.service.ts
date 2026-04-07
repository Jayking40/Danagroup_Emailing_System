import { User } from "@modules/users/entities/user.entity";
import { Injectable } from "@nestjs/common";
import { ElasticsearchService } from "@nestjs/elasticsearch";
import { response } from "express";
import { MessageSearchBody, UserSearchBody } from "src/types/types";



@Injectable()
export class SearchService {
   private readonly USER_INDEX = 'dims-users';
   private readonly MESSAGE_INDEX = 'dims-messages';

  constructor(private readonly es: ElasticsearchService) {}

  // Low-level ES User Search
  async searchUsers(
  query: string, 
  limit = 10, 
  filters?: { department?: string; subsidiary?: string; role?: string }
) {
    const response =  await this.es.search<UserSearchBody>({
      index: this.USER_INDEX,
      size: limit,
      query: {
        bool: { // All logic must be inside here
          must: [
            {
              multi_match: {
                query,
                fields: ['firstName^3', 'lastName^3', 'email'],
                fuzziness: 'AUTO',
              },
            },
          ],
          filter: [ // Filters go here and do not affect scoring
            { term: { isActive: true } },
            ...(filters?.department ? [{ term: { 'department.keyword': filters.department } }] : []),
            ...(filters?.subsidiary ? [{ term: { 'subsidiary.keyword': filters.subsidiary } }] : []),
            ...(filters?.role ? [{ term: { 'role.keyword': filters.role } }] : []),
          ],
        },
      },
    });

    return response.hits;
  }



  // TODO: Implement indexMessage(message): void
  //   - Index in 'dims-messages' index: id, subject, body, senderId, recipientIds, sentAt
  async indexMessage(message: any) { // Use your Message Entity type here
    return this.es.index<MessageSearchBody>({
      index: this.MESSAGE_INDEX,
      id: message.id,
      document: {
        id: message.id,
        subject: message.subject,
        body: message.body,
        senderId: message.senderId,
        recipientIds: message.recipients?.map(r => r.recipient_id) || [],
        sentAt: message.sentAt,
      },
    });
  }

  // TODO: Implement indexUser(user): void
  //   - Index in 'dims-users' index: id, firstName, lastName, email, jobTitle, department, subsidiary
  async indexUser(user: User) {
    return this.es.index<UserSearchBody>({
      index: this.USER_INDEX,
      id: user.id,
      document: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        department: user.department?.name,
        subsidiary: user.subsidiary?.name,
        role: user.role,
        isActive: user.isActive,
        avatarUrl: user.avatarUrl,
        createdAt: user.createdAt,
      },
    });
  }

  // TODO: Implement deleteUser(userId): void
  async deleteUser(userId: string) {
    return this.es.delete({
      index: this.USER_INDEX,
      id: userId,
      refresh: 'wait_for', // Ensures the user is gone before the next search
    }).catch(err => console.warn(`User ${userId} not found in ES for deletion`));
  }
 


  // TODO: Implement deleteMessage(messageId): void
  async deleteMessage(messageId: string) {
    return this.es.delete({
      index: this.MESSAGE_INDEX,
      id: messageId,
      refresh: 'wait_for',
    }).catch(err => console.warn(`Message ${messageId} not found in ES`));
  }
}
