import { User } from "@modules/users/entities/user.entity";
import { Injectable, Logger } from "@nestjs/common";
import { ElasticsearchService } from "@nestjs/elasticsearch";
import { InjectRepository } from "@nestjs/typeorm";
import { response } from "express";
import { MessageSearchBody, UserSearchBody } from "src/types/types";
import { Repository } from "typeorm";



@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);

  private readonly USER_INDEX = 'dims-users';
  private readonly MESSAGE_INDEX = 'dims-messages';

  constructor(
    @InjectRepository(User) 
    private readonly userRepo: Repository<User>,
    private readonly es: ElasticsearchService, 
  ) {}

  // This runs automatically when the app starts
  async onApplicationBootstrap() {
    this.logger.log('Initializing Elasticsearch indexes...');
    await this.ensureIndexExists(this.USER_INDEX);
    await this.ensureIndexExists(this.MESSAGE_INDEX);

    this.logger.log('Starting initial data sync...');
    await this.syncUsersToIndex();
    this.logger.log('Elasticsearch is ready and synced.');
  }

  private async ensureIndexExists(index: string) {
    const exists = await this.es.indices.exists({ index });
    if (!exists) {
      await this.es.indices.create({ index });
      this.logger.log(`Created missing index: ${index}`);
    }
  }

  async syncUsersToIndex() {
    const users = await this.userRepo.find();
    if (users.length === 0) return;

    // Use bulk indexing for better performance for many users
    const operations = users.flatMap(user => [
      { index: { _index: this.USER_INDEX, _id: user.id } },
      {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        department: user.department_id,
        subsidiary: user.subsidiary_id
      }
    ]);

    await this.es.bulk({ refresh: true, operations });
  }

  // Low-level ES User Search
  async searchUsers(
    query: string, 
    limit = 10, 
    filters?: { department?: string; subsidiary?: string; role?: string }
  ) {
    try {
      const response = await this.es.search<UserSearchBody>({
        index: this.USER_INDEX, // Make sure this is 'dims-users'
        size: limit,
        // 'body' is no longer required in modern ES clients; 
        // 'query' goes directly in the request object.
        query: {
          bool: {
            must: [
              {
                multi_match: {
                  query,
                  fields: ['firstName^3', 'lastName^3', 'email'],
                  fuzziness: 'AUTO',
                },
              },
            ],
            filter: [
              { term: { isActive: true } },
              ...(filters?.department ? [{ term: { 'department': filters.department } }] : []),
              ...(filters?.subsidiary ? [{ term: { 'subsidiary': filters.subsidiary } }] : []),
              ...(filters?.role ? [{ term: { 'role': filters.role } }] : []),
            ],
          },
        },
      });

      return response.hits;

    } catch (error) {
      // Catch the missing index error so the app doesn't crash
      if ((error as any).meta?.body?.error?.type === 'index_not_found_exception') {
        console.warn(`Elasticsearch index "${this.USER_INDEX}" not found. Returning empty.`);
        return { total: { value: 0, relation: 'eq' }, hits: [] };
      }
      throw error;
    }
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
        sentAt: message.sentAt || new Date(),
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
