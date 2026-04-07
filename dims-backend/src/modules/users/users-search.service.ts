// src/users/users-search.service.ts
import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { User } from './entities/user.entity';

interface UserSearchBody {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  department?: string;
  subsidiary?: string;
  isActive: boolean;
  avatarUrl: string;
  createdAt: Date;
}

@Injectable()
export class UsersSearchService {
  private readonly index = 'users';

  constructor(private readonly es: ElasticsearchService) {}

  async indexUser(user: User) {
    return this.es.index<UserSearchBody>({
      index: this.index,
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

  async remove(id: string) {
    return this.es.delete({ index: this.index, id });
  }

  async search(
    query: string,
    filters?: { department?: string; subsidiary?: string; role?: string },
    page = 1,
    limit = 10,
  ) {
    const must = [{ multi_match: { query, fields: ['name^3', 'email', 'department'], fuzziness: 'AUTO' } }];
    const filter = [];

    if (filters?.department) filter.push({ term: { department: filters.department } });
    if (filters?.subsidiary) filter.push({ term: { subsidiary: filters.subsidiary } });
    if (filters?.role) filter.push({ term: { role: filters.role } });

    const { hits } = await this.es.search<User>({
      index: this.index,
      from: (page - 1) * limit,
      size: limit,
      query: { bool: { must, filter } },
      sort: [{ name: { order: 'asc' } }],
    });

    return {
      total: hits.total,
      results: hits.hits.map((h) => ({ id: h._id, ...h._source })),
    };
  }
}
