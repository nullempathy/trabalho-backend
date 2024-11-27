import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from "typeorm";
import { Stock } from "./Stock";

@Entity("purchases")
class Purchase {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: false })
  productName: string;

  @Column("int", { default: 0 })
  quantity: number;

  @Column("decimal", { precision: 10, scale: 2, default: 0.0 })
  price: number;

  @OneToMany(() => Stock, (stock) => stock.purchase)
  stocks: Stock[];

  @CreateDateColumn()
  purchaseDate: Date; // Automatically assigns current timestamp
}

export { Purchase };
