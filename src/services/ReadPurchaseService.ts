import { db } from "../server";
import { Purchase } from "../entities/Purchase";

interface IReadPurchaseFilters {
  productName?: string;
  price?: number;
  quantity?: number;
  purchaseDate?: string; // Formato esperado: yyyy-mm-dd
}

class ReadPurchaseService {
  async execute(filters: IReadPurchaseFilters = {}): Promise<Purchase[]> {
    const { productName, price, quantity, purchaseDate } = filters;

    // Processamento do filtro de data
    let dateFilter: Date | undefined;
    if (purchaseDate) {
      const parsedDate = new Date(purchaseDate);
      if (isNaN(parsedDate.getTime())) {
        throw new Error("Invalid purchaseDate format. Use yyyy-mm-dd.");
      }
      dateFilter = parsedDate;
    }

    // Monta os filtros para o método `readPurchase`
    const processedFilters: Partial<Purchase> = {
      ...(productName && { productName }),
      ...(price && { price }),
      ...(quantity && { quantity }),
      ...(dateFilter && { purchaseDate: dateFilter }),
    };

    // Consulta no banco
    return await db.readPurchase(processedFilters);
  }
}

export { ReadPurchaseService };
