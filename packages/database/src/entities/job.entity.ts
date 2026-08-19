import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("jobs")
@Index(["source", "externalId"], { unique: true })
export class JobEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ length: 80 })
  source!: string;

  @Column({ length: 255 })
  externalId!: string;

  @Column({ length: 160 })
  companyName!: string;

  @Column({ length: 255 })
  title!: string;

  @Column({ type: "text" })
  description!: string;

  @Column({ length: 160 })
  location!: string;

  @Column({ length: 40 })
  remoteType!: string;

  @Column({ type: "int" })
  matchScore!: number;

  @Column("text", { array: true, default: "{}" })
  skills!: string[];

  @Column({ length: 500 })
  applyUrl!: string;

  @Column({ default: true })
  isActive!: boolean;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt!: Date;
}
