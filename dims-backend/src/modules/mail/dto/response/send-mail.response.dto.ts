import { ApiProperty } from "@nestjs/swagger";

export class SendMailResponseDto {
  @ApiProperty()
  messageId: string;

  @ApiProperty()
  threadId: string;

  @ApiProperty()
  sentAt: Date;

  @ApiProperty()
  status: string;
}
