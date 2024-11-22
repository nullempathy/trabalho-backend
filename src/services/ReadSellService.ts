import { db } from "../server";
import { Sell } from "../entities/Sell";

interface IReadSellFilters {
  sellDate?: string; // yyyy-mm-dd
  productName?: string;
  productPrice?: number;
}

class ReadSellService {
  async execute(filters: IReadSellFilters): Promise<Sell[]> {
    const { sellDate, productName, productPrice } = filters;

    const whereConditions: any = {};

    if (sellDate) {
      const date = new Date(sellDate);
      if (isNaN(date.getTime())) throw new Error("Invalid date format. Use yyyy-mm-dd.");
      whereConditions.sellDate = date;
    }

    if (productName) {
      whereConditions.productName = productName;
    }

    if (productPrice !== undefined) {
      whereConditions.productPrice = productPrice;
    }

    return db.readSell(whereConditions);
  }
}


export { ReadSellService };
