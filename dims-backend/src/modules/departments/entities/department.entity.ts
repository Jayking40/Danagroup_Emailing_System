import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Unique,
} from "typeorm";
import { Subsidiary } from "./subsidiary.entity";
import { User } from "@modules/users/entities/user.entity";

@Entity("departments")
@Unique(["name", "subsidiaryId"])
export class Department {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ length: 100 })
  name: string;

  @CreateDateColumn({
    type: "timestamptz",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: "timestamptz",
    default: () => "CURRENT_TIMESTAMP",
  })
  updatedAt: Date;

  // Relationships

  //Expose the ID directly as a string for easier filtering/saving
  @Column({ type: "uuid" })
  subsidiaryId: string;

  @ManyToOne(() => Subsidiary, (subsidiary) => subsidiary.departments, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn()
  subsidiary: Subsidiary;

  @OneToMany(() => User, (user) => user.department)
  users: User[];
}
