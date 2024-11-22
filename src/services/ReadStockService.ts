import { db } from "../server";
import { Stock } from "../entities/Stock";

interface IReadStockDTO {
  status?: Stock["status"];
  productName?: string;
  productPrice?: number;
}

class ReadStockService {
  async execute(filters: IReadStockDTO): Promise<Stock[]> {
    const stocks = await db.readStock(filters);
    return stocks;
  }
}

export { ReadStockService };
