import { db } from "../server";
import { Stock } from "../entities/Stock";

interface ICreateStockDTO {
  productId: string;
  quantity: number;
}

class CreateStockService {
  async execute({ productId, quantity }: ICreateStockDTO): Promise<Stock> {
    if (!productId) throw new Error("Product ID is required.");
    if (quantity == null || quantity < 0) throw new Error("Quantity must be a non-negative number.");

    const stock = await db.createStock(productId, quantity);
    return stock;
  }
}

export { CreateStockService };