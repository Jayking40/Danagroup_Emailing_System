import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString() name: string;
  @IsEmail() email: string;

  @IsOptional() @IsString() department?: string;
  @IsOptional() @IsString() subsidiary?: string;
  @IsOptional() @IsString() avatarUrl?: string;
  @IsOptional() @IsString() role?: string;
}
