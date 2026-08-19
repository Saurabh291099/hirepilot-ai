import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("applications")
@Index(["userId", "updatedAt"])
export class ApplicationEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column("uuid")
  userId!: string;

  @Column("uuid", { nullable: true })
  jobId!: string | null;

  @Column({ length: 160 })
  company!: string;

  @Column({ length: 255 })
  role!: string;

  @Column({ length: 40 })
  status!: string;

  @Column({ type: "date" })
  appliedAt!: string;

  @Column({ type: "varchar", length: 500, nullable: true })
  applyUrl!: string | null;

  @Column({ type: "text", nullable: true })
  notes!: string | null;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt!: Date;
}
