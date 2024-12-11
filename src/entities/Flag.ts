import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("flags")
class Flag {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: false, unique: true })
  name: string;

  @Column({ type: "boolean", default: false })
  value: boolean;
}

export { Flag };
