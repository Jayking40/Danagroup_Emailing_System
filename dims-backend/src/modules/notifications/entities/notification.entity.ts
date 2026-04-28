import { User } from "@modules/users/entities/user.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";

export type NotificationType = "new_mail" | "announcement" | "system";

@Entity("notifications")
export class Notification {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    type: "enum",
    enum: ["new_mail", "announcement", "system"],
    default: "system",
  })
  type: NotificationType;

  @Column()
  title: string;

  @Column({ nullable: true, type: "text" })
  body: string;

  @Column({ default: false })
  isRead: boolean;

  @Column({ nullable: true, type: "uuid" })
  referenceId: string;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt: Date;

  // ---- RELATIONSHIPS ----
  @ManyToOne(() => User, (user) => user.notifications)
  @JoinColumn()
  user: User;

  @Column({ type: "uuid" })
  userId: string;
}
