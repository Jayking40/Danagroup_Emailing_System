import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Message } from "../../mail/entities/message.entity";

@Entity("attachments")
export class Attachment {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  uploaderId: string;

  @Column({ length: 255 })
  filename: string;

  @Column({ length: 100 })
  mime_type: string;

  @Column({ type: "bigint" })
  sizeBytes: number;

  @Column({ length: 500 })
  storageKey: string;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt: Date;

  //---- RELATIONSHIPS ----
  @ManyToOne(() => Message, (msg) => msg.attachments, { onDelete: "CASCADE" })
  @JoinColumn()
  message: Message;

  @Column({ type: "uuid", nullable: true })
  messageId: string | null;
}
