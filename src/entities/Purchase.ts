import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity("purchases")
class Purchase {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: false })
  productName: string; // Renomeado para maior clareza

  @Column("int", { default: 0 })
  quantity: number;

  @Column("decimal", { precision: 10, scale: 2, default: 0.0 })
  price: number;

  @CreateDateColumn()
  purchaseDate: Date; // Automatically assigns current timestamp
}

export { Purchase };
