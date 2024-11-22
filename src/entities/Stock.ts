import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Product } from "./Product";

export enum StockStatus {
  AVAILABLE = "Disponível",
  LOW_STOCK = "Perto de acabar",
  OUT_OF_STOCK = "Esgotado",
}

@Entity("stocks")
class Stock {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Product, (product) => product.stocks, { eager: true })
  product: Product;

  @Column("int")
  quantity: number;

  @Column({
    type: "enum",
    enum: StockStatus,
    default: StockStatus.OUT_OF_STOCK,
  })
  status: StockStatus;
}

export { Stock };
