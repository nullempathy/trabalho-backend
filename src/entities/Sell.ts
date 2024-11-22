import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
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

  @Column("timestamp")
  sellDate: Date;
}

export { Sell };
