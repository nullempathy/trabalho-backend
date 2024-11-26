import { db } from "../server";
import { Sell } from "../entities/Sell";

interface ICreateSellDTO {
  stockId: string;
  quantity: number;
  unitPrice: number;
  sellDate: string; // yyyy-mm-dd
}

class CreateSellService {
  async execute({ stockId, quantity, unitPrice, sellDate }: ICreateSellDTO): Promise<Sell> {
    if (!stockId) throw new Error("Stock ID is required.");
    if (quantity == null || quantity <= 0) throw new Error("Quantity must be a positive number.");
    if (!unitPrice || unitPrice <= 0) throw new Error("Unit price must be a positive number.");
    if (!sellDate || !/^\d{4}-\d{2}-\d{2}$/.test(sellDate)) {
      throw new Error("Invalid date format. Use yyyy-mm-dd.");
    }

    // Converte a data de string para Date
    const sellDateObj = new Date(sellDate);

    // Chama o método `createSell` no banco
    const sell = await db.createSell(stockId, quantity, unitPrice, sellDateObj);

    if (!sell) throw new Error("Error creating sell record.");

    return sell;
  }
}

export { CreateSellService };
