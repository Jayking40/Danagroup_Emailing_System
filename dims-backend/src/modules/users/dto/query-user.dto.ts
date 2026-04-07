import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class QueryUserDto {
  @IsOptional() @IsString() search?: string;
  @IsOptional() @IsString() department?: string;
  @IsOptional() @IsString() subsidiary?: string;
  @IsOptional() @IsString() role?: string;

  @IsOptional() @Type(() => Number) @IsInt() @Min(1)
  page = 1;

  @IsOptional() @Type(() => Number) @IsInt() @Min(1)
  limit = 10;

  @IsOptional() @IsString()
  sortBy: 'name' | 'department' | 'createdAt' = 'name';
}
