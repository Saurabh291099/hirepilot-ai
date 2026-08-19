import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("resumes")
export class ResumeEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column("uuid")
  userId!: string;

  @Column({ length: 255 })
  filename!: string;

  @Column({ length: 80 })
  status!: "PROCESSING" | "READY" | "FAILED";

  @Column({ type: "jsonb", default: {} })
  extractedProfile!: Record<string, unknown>;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt!: Date;
}
