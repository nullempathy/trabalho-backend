import { db } from "../server";
import { Stock } from "../entities/Stock";

interface ICreateStockDTO {
  purchaseId: string;
  quantity: number;
}

class CreateStockService {
  async execute({ purchaseId, quantity }: ICreateStockDTO): Promise<Stock> {
    if (!purchaseId) throw new Error("Purchase ID is required.");
    if (quantity == null || quantity < 0) throw new Error("Quantity must be a non-negative number.");

    const stock = await db.createStock(purchaseId, quantity);
    return stock;
  }
}

export { CreateStockService };