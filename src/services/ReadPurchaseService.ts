import { Between, Like } from "typeorm";
import { Purchase } from "../entities/Purchase";
import { db } from "../server";

interface IReadPurchaseFilters {
  productName?: string;
  price?: { min?: number; max?: number }; // Intervalo de preço
  quantity?: { min?: number; max?: number }; // Intervalo de quantidade
  year?: string; // Ano
  month?: string; // Mês (1 a 12)
  day?: string; // Dia (1 a 31)
}

class ReadPurchaseService {
  async execute(filters: IReadPurchaseFilters = {}): Promise<Purchase[]> {
    const { productName, price, quantity, year, month, day } = filters;

    const processedFilters: any = {};

    if (productName) processedFilters.productName = Like(`%${productName}%`);
    if (price) {
      if (price.min !== undefined || price.max !== undefined) {
        processedFilters.price = Between(price.min ?? 0, price.max ?? Number.MAX_VALUE);
      }
    }
    if (quantity) {
      if (quantity.min !== undefined || quantity.max !== undefined) {
        processedFilters.quantity = Between(quantity.min ?? 0, quantity.max ?? Number.MAX_VALUE);
      }
    }

    // Lógica de data: ano, mês e dia
    if (year) {
      const startDate = new Date(Date.UTC(Number(year), month ? Number(month) - 1 : 0, day ? Number(day) : 1));
      const endDate = day
        ? new Date(Date.UTC(Number(year), Number(month || "12") - 1, Number(day), 23, 59, 59, 999))
        : month
        ? new Date(Date.UTC(Number(year), Number(month), 0, 23, 59, 59, 999))
        : new Date(Date.UTC(Number(year), 11, 31, 23, 59, 59, 999));

        console.log("Start Date Purchase:", startDate);  // Log para verificar
        console.log("End Date Purchase:", endDate);      // Log para verificar

      processedFilters.purchaseDate = Between(startDate, endDate);
    }

    return await db.readPurchase(processedFilters);
  }
}

export { ReadPurchaseService };
