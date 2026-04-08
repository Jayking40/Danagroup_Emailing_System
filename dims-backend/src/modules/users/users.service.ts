import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ILike, Repository } from "typeorm";
import { User, UserRole } from "./entities/user.entity";
import { QueryUserDto } from "./dto/query-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { CreateUserDto } from "./dto/create-user.dto";
import { UsersSearchService } from "./users-search.service";
import { SearchService } from "@modules/search/search.service";


interface FindAllParams {
  page?: number;
  limit?: number;
  email?: string;
  role?: string;
  is_active?: boolean;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly searchUser: SearchService,
    private readonly usersSearch: UsersSearchService,
  ) {}

  private handleError(method: string, error: any) {
    // Do not mask NestJS known exceptions (BadRequestException, etc.)
    console.error(`❌ UsersService.${method} failed:`, {
      message: error.message,
      stack: error.stack,
    });
    throw error;
  }

  async updateSessions(id: string, sessions: any[]): Promise<void> {
    await this.userRepo.update(id, { sessions });
  }

  // TODO: Implement findAll(filters): paginated list of users
  async findAll(query: QueryUserDto) {
    try {
      const page = Number(query.page) || 1;
      const limit = Number(query.limit) || 10;
      const { search, department, subsidiary, role, sortBy } = query;
      const where = [];
      if (search) {
        where.push([
          { firstName: ILike(`%${search}%`) },
          { lastName: ILike(`%${search}%`) },
          { email: ILike(`%${search}%`) },
        ]);
      }
      if (department) where.push({ department });
      if (subsidiary) where.push({ subsidiary });
      if (role) where.push({ role });


      const [data, total] = await this.userRepo.findAndCount({
        where: where.length ? where : undefined,
        take: limit,
        skip: (page - 1) * limit,
        order: { [sortBy  || "firstName"]: 'ASC' },
      });
      return {
        data,
        pagination: {
          total,
          page,
          limit,
        },
      };
    } catch (error) {
      this.handleError("findAll", error);    }
  }
  // TODO: Implement findById(id): User
  async findById(id: string): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user;
  }

  // TODO: Implement findByEmail(email): User | null (used by AuthService)
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({
      where: { email },
      select: [
        "id",
        "email",
        "passwordHash",
        "role",
        "isActive",
        "firstName",
        "lastName",
      ]
    });
  }
  // TODO: Implement search(query): User[] (for RecipientInput autocomplete)
    // TODO: Implement search(query): User[] (for RecipientInput autocomplete)
  async search(
    query: string, 
    filters: { department?: string; subsidiary?: string; role?: string },
    page: number = 1,
    limit: number = 10
  ) {
    try {
      // Delegate the complex Elasticsearch logic to the dedicated search service
      const result = await this.usersSearch.unifiedSearch(query, "users", null, page, limit, filters);

      return {
        data: result.results,
        total: result.total,
        page,
        limit,
        lastPage: Math.ceil(parseInt(result.total.toString()) / limit),
      };
    } catch (error) {
      this.handleError("search", error);
    }
  }

  // TODO: Implement create(dto): User (admin only)
  async create(dto: CreateUserDto) {
    try {
      const newUser = this.userRepo.create({
        ...dto,
        role: dto.role as any,
        subsidiary: dto.subsidiary ? { id: dto.subsidiary } : undefined,
        department: dto.department ? { id: dto.department } : undefined,
      });
      const saved = await this.userRepo.save(newUser);
      await this.searchUser.indexUser(saved);
      return saved;
      
    } catch (error) {
      this.handleError("create", error);
    }
  }
  // TODO: Implement update(id, dto): User (admin or self)
  async update(id: string, dto: UpdateUserDto) {
    try {
      const existingUser = await this.findById(id);
      const updatedUser = await this.userRepo.save({
        ...existingUser, 
        ...dto,
        role: dto.role as any,
        subsidiary: dto.subsidiary ? { id: dto.subsidiary } : undefined,
        department: dto.department ? { id: dto.department } : undefined,
      });
      await this.searchUser.indexUser(updatedUser);
      return updatedUser;
      
    } catch (error) {
      this.handleError("update", error);
    }
  }
  // TODO: Implement deactivate(id): void (admin only, sets is_active = false)
  async deactivate(id: string): Promise<void> {
    try {
      const user = await this.findById(id);

      user.isActive = false;
      await this.userRepo.save(user);
    } catch (error) {
      this.handleError("deactivate", error);
    }
  }
}
