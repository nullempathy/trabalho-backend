import { db } from "../server";
import { Sell } from "../entities/Sell";

interface ICreateSellDTO {
  productId: string;
  quantity: number;
  sellDate: string; // yyyy-mm-dd
}

class CreateSellService {
  async execute({ productId, quantity, sellDate }: ICreateSellDTO): Promise<Sell> {
    if (!productId) throw new Error("Product ID is required.");
    if (quantity == null || quantity <= 0) throw new Error("Quantity must be a positive number.");
    if (!sellDate || !/^\d{4}-\d{2}-\d{2}$/.test(sellDate)) {
      throw new Error("Invalid date format. Use yyyy-mm-dd.");
    }

    // Converte a data de string para Date
    const sellDateObj = new Date(sellDate);

    // Chama o método `createSell` no banco
    return db.createSell(productId, quantity, sellDateObj);
  }
}

export { CreateSellService };
