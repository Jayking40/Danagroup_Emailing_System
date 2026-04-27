import {
  ArrayUnique,
  IsString,
  IsArray,
  IsUUID,
  IsOptional,
  IsNotEmpty,
  IsEmail,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";

const normalizeEmailList = ({ value }: { value: unknown }) => {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  const values = Array.isArray(value) ? value : String(value).split(",");
  return values
    .map((item) => String(item).trim().toLowerCase())
    .filter(Boolean);
};

export class SendMailDto {
  @ApiPropertyOptional({ description: "Thread ID for reply/forward" })
  @IsUUID()
  @IsOptional()
  threadId?: string;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  draftId?: string;

  @ApiProperty({ type: [String], example: ["user@example.com"] })
  @IsArray()
  @IsEmail({}, { each: true })
  @ArrayUnique()
  @Transform(normalizeEmailList)
  toEmails: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsArray()
  @IsEmail({}, { each: true })
  @ArrayUnique()
  @IsOptional()
  @Transform(normalizeEmailList)
  ccEmails?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsArray()
  @IsEmail({}, { each: true })
  @ArrayUnique()
  @IsOptional()
  @Transform(normalizeEmailList)
  bccEmails?: string[];

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  subject?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  body: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  bodyHtml?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsArray()
  @IsUUID("all", { each: true })
  @IsOptional()
  attachmentIds?: string[];
}
