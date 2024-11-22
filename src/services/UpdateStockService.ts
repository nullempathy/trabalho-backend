import { db } from "../server";
import { Stock } from "../entities/Stock";

interface IUpdateStockDTO {
  id: string;
  quantity: number;
}

class UpdateStockService {
  async execute({ id, quantity }: IUpdateStockDTO): Promise<Stock> {
    if (!id) throw new Error("Stock ID is required.");
    if (quantity == null || quantity < 0) throw new Error("Quantity must be a non-negative number.");

    return db.updateStock(id, quantity);
  }
}

export { UpdateStockService };
