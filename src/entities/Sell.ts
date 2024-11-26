import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm";
import { Stock } from "./Stock";

@Entity("sells")
class Sell {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Stock, { eager: true }) // Relaciona com Stock
  @JoinColumn({ name: 'stockId' })
  stock: Stock;

  @Column("int")
  quantity: number;

  @Column("decimal", { precision: 10, scale: 2 })
  price: number;

  @CreateDateColumn()
  sellDate: Date;
}

export { Sell };
